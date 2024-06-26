"use client";
import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/firebase/config";
import { getDocs, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import CustomButton from "./components/CustomButton/CustomButton.jsx";
import CreateDictionaryModal from "./components/CreateDictionaryModal/CreateDictionaryModal.jsx";
import NavBar from "./components/NavBar/navbar.jsx";
import SlidingMenu from "./components/SlidingMenu/SlidingMenu.jsx";
import MenuButton from "./components/MenuButton/MenuButton.jsx";
import DictionaryItem from "./components/DictionaryItem/DictionaryItem.jsx";
import { collection, query, where } from "firebase/firestore";
import "./home.css";

const Home = () => {
  const [user] = useAuthState(auth);
  const [showModal, setShowModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userDictionaries, setUserDictionaries] = useState([]);
  const [isFetchingDictionaries, setIsFetchingDictionaries] = useState(false);
  const router = useRouter();
  const isOpen = Boolean(anchorEl);

  const fetchUserDictionaries = async () => {
    if (user) {
      try {
        const querySnapshot = await getDocs(
          query(
            collection(db, "dictionaries"),
            where("ownerId", "==", user.uid),
          ),
        );
        const dictionaries = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserDictionaries(dictionaries);
      } catch (error) {
        console.error("Error fetching user dictionaries:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserDictionaries();
  }, [user]);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteDictionary = async dictionaryId => {
    try {
      await deleteDoc(doc(db, "dictionaries", dictionaryId));
      setUserDictionaries(prevState =>
        prevState.filter(dictionary => dictionary.id !== dictionaryId),
      );
    } catch (error) {
      console.error("Error deleting dictionary:", error);
    }
  };

  const handleDictionaryCreated = newDictionary => {
    setUserDictionaries(prevState => [...prevState, newDictionary]);
  };

  useEffect(() => {
    fetchUserDictionaries();
  }, [user]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavBar user={user} router={router}>
        {user && (
          <>
            <MenuButton onClick={handleClick} />
            <SlidingMenu
              userId={user.uid}
              onDictionaryCreated={handleDictionaryCreated}
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              firstHref="./profile"
              firstText="Profile"
            />
          </>
        )}
        <div className="flex flex-grow items-center justify-center">
          {!user && (
            <h1 className="ml-20 text-center text-white text-2xl font-bold">
              Your awesome Dictionary!
            </h1>
          )}
          {user && (
            <h1 className="text-center text-white text-2xl font-bold">
              Welcome {user.displayName}!
            </h1>
          )}
        </div>
        <ul className="flex space-x-4">
          {user ? (
            <>
              <CustomButton
                onClick={() => auth.signOut()}
                className="signOutButton"
              >
                Sign out
              </CustomButton>
            </>
          ) : (
            <>
              <CustomButton
                onClick={() => router.push("./signup")}
                className="customButton"
              >
                Register
              </CustomButton>
              <CustomButton
                onClick={() => router.push("./signin")}
                className="customButton"
              >
                Login
              </CustomButton>
            </>
          )}
        </ul>
      </NavBar>
      {user && (
        <>
          <div className="flex-grow max-w-screen-lg mx-auto mt-4 font-serif">
            {showModal && (
              <CreateDictionaryModal
                userId={user.uid}
                onClose={() => setShowModal(false)}
                onDictionaryCreated={handleDictionaryCreated}
              />
            )}
            <div className="mt-4">
              <h2
                className="text-xl 
                font-bold mb-2 text-black flex flex-wrap justify-center"
              >
                Your Dictionaries
              </h2>
              {isFetchingDictionaries ? (
                <p>Loading...</p>
              ) : (
                <ul className="flex flex-wrap justify-center">
                  {userDictionaries.length === 0 ? (
                    <p className="text-black">
                      No dictionaries found. Create a dictionary.
                    </p>
                  ) : (
                    userDictionaries.map(dictionary => (
                      <DictionaryItem
                        userId={user.uid}
                        key={dictionary.id}
                        dictionary={dictionary}
                        onDelete={handleDeleteDictionary}
                      />
                    ))
                  )}
                </ul>
              )}
            </div>
          </div>
          <CustomButton
            onClick={() => setShowModal(true)}
            className="customButton rounded-none"
          >
            Create Dictionary
          </CustomButton>
        </>
      )}
    </div>
  );
};

export default Home;
