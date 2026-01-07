export const ReadStatusEnum = {
  UNREAD: "unread",
  IN_PROGRESS: "in_progress",
  DONE: "done",
} as const;

export type ReadStatus = (typeof ReadStatusEnum)[keyof typeof ReadStatusEnum];

//  Drizzle enum 배열(튜플)로 변환
export const READ_STATUS = [
  ReadStatusEnum.UNREAD,
  ReadStatusEnum.IN_PROGRESS,
  ReadStatusEnum.DONE,
] as const satisfies readonly ReadStatus[];
