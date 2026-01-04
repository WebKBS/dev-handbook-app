import { AppText } from "@/components/text/AppText";
import { Domain, DomainType } from "@/constants/domain";
import { useRootManifest } from "@/hooks/services/useRootManifest";
import { Theme, useTheme } from "@/providers/ThemeProvider";
import { RootManifestResponse } from "@/services/content/root-manifest";
import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
} from "d3-force";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, G, Line, Text as SvgText } from "react-native-svg";

type GraphNode = {
  id: string; // unique
  kind: "domain" | "item";
  label: string;
  domain?: DomainType;
  itemId?: string; // item.id
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
};

// ✅ 렌더링 전용 링크 (절대 d3-force에 mutate 당하지 않게)
type RenderLink = {
  sourceId: string;
  targetId: string;
};

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

const GRAPH_W = SCREEN_W;
const GRAPH_H = SCREEN_H; // 한 스크린 가득

function buildDomainGraph(manifest: RootManifestResponse) {
  const domains = Array.from(new Set(manifest.items.map((i) => i.domain)));

  const domainNodes: GraphNode[] = domains.map((d) => ({
    id: `domain:${d}`,
    kind: "domain",
    label: String(d).toUpperCase(),
    domain: d,
  }));

  const itemNodes: GraphNode[] = manifest.items.map((i) => ({
    id: `item:${i.id}`,
    kind: "item",
    label: i.title,
    domain: i.domain,
    itemId: i.id,
  }));

  // ✅ 렌더링용 링크는 string id만 유지
  const renderLinks: RenderLink[] = manifest.items.map((i) => ({
    sourceId: `domain:${i.domain}`,
    targetId: `item:${i.id}`,
  }));

  return { nodes: [...domainNodes, ...itemNodes], renderLinks };
}

const DOMAIN_COLORS: Record<DomainType, string> = {
  [Domain.html]: "#f97316",
  [Domain.css]: "#2563eb",
  [Domain.javascript]: "#f59e0b",
  [Domain.typescript]: "#0ea5e9",
  [Domain.react]: "#22d3ee",
  [Domain.web]: "#10b981",
};

function clamp(n: number, min: number, max: number) {
  "worklet";
  return Math.min(max, Math.max(min, n));
}

function isFiniteNode(n?: GraphNode | null) {
  return !!n && Number.isFinite(n.x) && Number.isFinite(n.y);
}

export default function GraphScreenContainer() {
  const { theme } = useTheme();
  const themedStyles = useMemo(() => createStyles(theme), [theme]);
  const { data, isPending, error, refetch } = useRootManifest();

  const router = useRouter();

  const manifest: RootManifestResponse | null = useMemo(() => {
    if (!data) return null;
    return {
      version: data.version,
      generatedAt: data.generatedAt,
      items: data.items,
    };
  }, [data]);

  const { nodes: rawNodes, renderLinks: rawRenderLinks } = useMemo(() => {
    if (!manifest) return { nodes: [], renderLinks: [] as RenderLink[] };
    return buildDomainGraph(manifest);
  }, [manifest]);

  const [nodes, setNodes] = useState<GraphNode[] | null>(null);
  const [links, setLinks] = useState<RenderLink[]>([]);

  // -------------------------
  // 줌/패닝 상태 (Reanimated)
  // -------------------------
  const scale = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  const savedScale = useSharedValue(1);
  const savedTx = useSharedValue(0);
  const savedTy = useSharedValue(0);

  useEffect(() => {
    tx.value = 0;
    ty.value = 0;
    savedTx.value = 0;
    savedTy.value = 0;
  }, [tx, ty, savedTx, savedTy]);

  const pinch = Gesture.Pinch()
    .onBegin(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((e) => {
      const next = savedScale.value * e.scale;
      scale.value = clamp(next, 0.5, 3.5);
    })
    .onEnd(() => {
      scale.value = withTiming(scale.value, { duration: 120 });
    });

  const pan = Gesture.Pan()
    .onBegin(() => {
      savedTx.value = tx.value;
      savedTy.value = ty.value;
    })
    .onUpdate((e) => {
      tx.value = savedTx.value + e.translationX;
      ty.value = savedTy.value + e.translationY;
    });

  const composed = Gesture.Simultaneous(pinch, pan);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { scale: scale.value },
    ],
  }));

  // -------------------------
  // d3-force 레이아웃 계산
  // -------------------------
  useEffect(() => {
    if (!rawNodes.length) {
      setNodes([]);
      setLinks([]);
      return;
    }

    // d3-force는 mutate하므로 복사본 사용
    const simNodes = rawNodes.map((n) => ({ ...n }));

    // ✅ 시뮬레이션용 링크(여기는 mutate되어도 됨)
    const simLinks = rawRenderLinks.map((l) => ({
      source: l.sourceId,
      target: l.targetId,
    }));

    const sim = forceSimulation(simNodes as any)
      .force(
        "link",
        forceLink(simLinks as any)
          .id((d: any) => d.id)
          .distance(120),
      )
      .force(
        "charge",
        forceManyBody().strength((d: any) =>
          d.kind === "domain" ? -900 : -260,
        ),
      )
      .force("center", forceCenter(GRAPH_W / 2, GRAPH_H / 2));

    // 안정화
    for (let i = 0; i < 220; i++) sim.tick();
    sim.stop();

    // 화면 경계 clamp + NaN 방지
    const margin = 40;
    const fixed = simNodes.map((n) => {
      const x = Number.isFinite(n.x) ? (n.x as number) : GRAPH_W / 2;
      const y = Number.isFinite(n.y) ? (n.y as number) : GRAPH_H / 2;
      return {
        ...n,
        x: Math.min(GRAPH_W - margin, Math.max(margin, x)),
        y: Math.min(GRAPH_H - margin, Math.max(margin, y)),
      };
    });

    setNodes(fixed);

    // ✅ 렌더링 링크는 원본(문자열 id) 그대로 유지
    setLinks(rawRenderLinks);
  }, [rawNodes, rawRenderLinks]);

  // ✅ 노드 조회 최적화 (links 렌더링에서 find() 제거)
  const nodeMap = useMemo(() => {
    const m = new Map<string, GraphNode>();
    (nodes ?? []).forEach((n) => m.set(n.id, n));
    return m;
  }, [nodes]);

  const openItem = async (itemId: string) => {
    const domain = itemId.split("/")[0];
    const slug = itemId.split("/")[1];
    router.push(`/learn/${domain}/${slug}`);
  };

  const getDomainColor = (domain?: DomainType) =>
    (domain && DOMAIN_COLORS[domain]) || theme.colors.accentStrong;

  const domainNodeRadius = 18;
  const itemNodeRadius = 10;

  if (isPending && !manifest) {
    return (
      <View style={themedStyles.loading}>
        <ActivityIndicator color={theme.colors.accent} />
        <AppText style={themedStyles.loadingText}>
          그래프 데이터를 불러오는 중
        </AppText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={themedStyles.loading}>
        <AppText style={themedStyles.loadingText}>
          {(error as Error).message || "그래프 정보를 불러오지 못했어요"}
        </AppText>
        <Pressable style={themedStyles.retryButton} onPress={() => refetch()}>
          <AppText style={themedStyles.retryText}>다시 시도</AppText>
        </Pressable>
      </View>
    );
  }

  if (manifest && nodes === null) {
    return (
      <View style={themedStyles.loading}>
        <ActivityIndicator color={theme.colors.accent} />
        <AppText style={themedStyles.loadingText}>
          그래프 레이아웃 계산 중
        </AppText>
      </View>
    );
  }

  if (!nodes || nodes.length === 0) {
    return (
      <View style={themedStyles.loading}>
        <AppText style={themedStyles.loadingText}>
          표시할 그래프 데이터가 없습니다.
        </AppText>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={themedStyles.root}>
      <GestureDetector gesture={composed}>
        <View style={themedStyles.graphWrap}>
          <Animated.View style={[themedStyles.graphInner, animatedStyle]}>
            <Svg width={GRAPH_W} height={GRAPH_H}>
              <G>
                {/* Links */}
                {links.map((l, idx) => {
                  const s = nodeMap.get(l.sourceId);
                  const t = nodeMap.get(l.targetId);

                  if (!isFiniteNode(s) || !isFiniteNode(t)) return null;

                  const domainColor =
                    (s?.kind === "domain" && getDomainColor(s.domain)) ||
                    getDomainColor(t?.domain);

                  return (
                    <Line
                      key={`link-${idx}`}
                      x1={s!.x as number}
                      y1={s!.y as number}
                      x2={t!.x as number}
                      y2={t!.y as number}
                      stroke={domainColor}
                      strokeWidth={2.25}
                      strokeOpacity={0.85}
                      strokeLinecap="round"
                    />
                  );
                })}

                {/* Nodes */}
                {nodes.map((n) => {
                  if (!Number.isFinite(n.x) || !Number.isFinite(n.y))
                    return null;

                  const x = n.x as number;
                  const y = n.y as number;

                  if (n.kind === "domain") {
                    const domainColor = getDomainColor(n.domain);
                    return (
                      <React.Fragment key={n.id}>
                        <Circle
                          cx={x}
                          cy={y}
                          r={domainNodeRadius}
                          fill={theme.colors.surface}
                          stroke={domainColor}
                          strokeWidth={3}
                        />
                        <SvgText
                          x={x}
                          y={y + 4}
                          fontSize={11}
                          fill={theme.colors.text}
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          {n.label}
                        </SvgText>
                      </React.Fragment>
                    );
                  }

                  const domainColor = getDomainColor(n.domain);
                  return (
                    <React.Fragment key={n.id}>
                      <Circle
                        cx={x}
                        cy={y}
                        r={itemNodeRadius}
                        fill={domainColor}
                        stroke={theme.colors.background}
                        strokeWidth={1}
                        onPress={() => {
                          if (n.itemId) openItem(n.itemId);
                        }}
                      />
                      <SvgText
                        x={x + 14}
                        y={y + 4}
                        fontSize={10}
                        fill={theme.colors.text}
                      >
                        {n.label}
                      </SvgText>
                    </React.Fragment>
                  );
                })}
              </G>
            </Svg>
          </Animated.View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    graphWrap: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      overflow: "hidden",
    },
    graphInner: {
      width: GRAPH_W,
      height: GRAPH_H,
    },
    loading: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    loadingText: {
      marginTop: 10,
      fontSize: 12,
      color: theme.colors.muted,
      textAlign: "center",
    },
    retryButton: {
      marginTop: 16,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 10,
      backgroundColor: theme.colors.accentSubtle,
      borderWidth: 1,
      borderColor: theme.colors.accentStrong,
    },
    retryText: {
      color: theme.colors.accentStrong,
      textAlign: "center",
      fontSize: 13,
      fontWeight: "600",
    },
  });
