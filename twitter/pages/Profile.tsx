import { authService, dbService } from "@src/fbase";
import { updateProfile, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

type Props = {};

const Profile = ({ userObj, refreshUser }: { userObj: null | User; refreshUser: () => void }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj?.displayName);
  useEffect(() => {
    getMyTweets();
  }, []);
  const onLogOutClick = () => {
    authService.signOut();
  };
  const getMyTweets = async () => {
    const tweetsRef = collection(dbService, "tweets");
    if (userObj) {
      const tweetsQuery = query(
        tweetsRef,
        where("creatorid", "==", userObj?.uid),
        orderBy("createdAt"),
      );
      const tweetsQuerySnapshot = await getDocs(tweetsQuery);
      tweetsQuerySnapshot.forEach((doc) => {});
    }
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (userObj && userObj.displayName !== newDisplayName) {
      const user = authService.currentUser;
      user &&
        (await updateProfile(user, {
          displayName: newDisplayName,
        }));

      refreshUser();
    }
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          type="text"
          placeholder="Display name"
          onChange={onChange}
          autoFocus
          className="formInput"
          value={newDisplayName as string}
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;
