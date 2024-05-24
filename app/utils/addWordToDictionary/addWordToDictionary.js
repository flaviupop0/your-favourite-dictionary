import { db } from "../../firebase/config";

export async function addWordToDictionary(dictionaryId, wordData) {
  const dictionaryRef = doc(db, "dictionaries", dictionaryId);
  try {
    await updateDoc(dictionaryRef, {
      words: arrayUnion(wordData),
    });
    console.log("Word added to dictionary successfully!");
  } catch (error) {
    console.error("Error adding word to dictionary:", error);
    throw error;
  }
}
