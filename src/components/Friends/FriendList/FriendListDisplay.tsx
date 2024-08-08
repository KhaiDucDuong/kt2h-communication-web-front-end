"use client";
import { useEffect, useState } from "react";
import FriendRow from "./FriendRow";

interface Friend {
  friend_id: string;
  first_name: string;
  last_name: string;
  image: string;
  status?: string;
}

const FriendListDisplay = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [friends, setFriends] = useState<Friend[]>([]);

  async function fetchFriendList() {
    const res = await fetch(`/friends/friend-list/api?page=${currentPage}`, {
      method: "GET",
    });
    const data = await res.json();
    if (data.body.statusCode === 200) {
      setFriends(data.body.data.result);
      setTotalPage(data.body.data.meta.total);
    }
    console.log("Response :" + JSON.stringify(data.body));
  }

  useEffect(() => {
    fetchFriendList();
  }, []);

  return (
    <section className="size-full flex flex-col">
      <div className="w-[96%] h-[40px] pl-[14px] text-gray-2 self-center flex flex-col justify-end">Total friends: {friends.length}</div>
      {friends.length > 0 &&
        friends.map((friend) => {
          return (
            <FriendRow
              id={friend.friend_id}
              image={friend.image}
              firstName={friend.first_name}
              lastName={friend.last_name}
              status={"Online"}
            />
          );
        })}
    </section>
  );
};

export default FriendListDisplay;
