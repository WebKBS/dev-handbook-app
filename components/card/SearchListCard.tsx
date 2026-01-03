import SearchResultCard from "@/components/card/SearchResultCard";
import SearchEmptyResult from "@/components/empty/SearchEmptyResult";
import SearchResultHeader from "@/components/header/SearchResultHeader";
import { StyleSheet, View } from "react-native";

export type SearchResult = {
  id?: string;
  title: string;
  desc: string;
  domain: string;
  icon: string;
  tags: string[];
};

interface SearchListCardProps {
  filteredDocs: SearchResult[];
}

const SearchListCard = ({ filteredDocs }: SearchListCardProps) => {
  return (
    <>
      <SearchResultHeader count={filteredDocs.length} />

      {filteredDocs.length === 0 ? (
        <SearchEmptyResult />
      ) : (
        <View style={styles.resultList}>
          {filteredDocs.map((doc) => (
            <SearchResultCard
              key={doc.id ?? doc.title}
              doc={{ ...doc, id: doc.id ?? doc.title }}
            />
          ))}
        </View>
      )}
    </>
  );
};

export default SearchListCard;

const styles = StyleSheet.create({
  resultList: {
    gap: 12,
  },
});
