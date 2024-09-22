"use client";
import { useEffect, useState } from "react";
import FriendRow from "./FriendRow";
import FriendListDisplayLoading from "./FriendListDisplayLoading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

interface Friend {
  friend_id: string;
  first_name: string;
  last_name: string;
  image: string;
  status?: string;
}

const FriendListDisplay = () => {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function fetchFriendList() {
    
    let res;
    try {
      res = await fetch(`/dashboard/api/friend?page=${currentPage}`, {
        method: "GET",
      });
      
      if(res.status !== 200) {
        throw new Error("Failed to fetch friend list");
      }

      const data = await res.json();
      if (data.body.statusCode === 200) {
        setFriends(data.body.data.result);
        setTotalPage(data.body.data.meta.total);
        return data.body.data.result;
      }
      console.log("Response :" + JSON.stringify(data.body));
    } catch (error) {
      console.log("Error: " + error);
    }

    if (res?.status === 401) {
      router.push("/");
    }
  }

  useEffect(() => {
    fetchFriendList().then((data) => {
      // setFriends(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <FriendListDisplayLoading />;
  }

  return (
    <ScrollArea>
      <section className="size-full flex flex-col">
        <div className="mb-[10px] w-[96%] h-[40px] pl-[14px] text-gray-2 self-center flex flex-col justify-end">
          Total friends: {friends.length}
        </div>
        {friends.map((friend) => {
          return (
            <FriendRow
              key={friend.friend_id}
              id={friend.friend_id}
              image={friend.image}
              firstName={friend.first_name}
              lastName={friend.last_name}
              status={"Online"}
            />
          );
        })}
      </section>
    </ScrollArea>
  );
};

export default FriendListDisplay;
