import { FriendRequestTab } from "@/types/ui";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import FriendRequestDisplayLoading from "./FriendRequestDisplayLoading";
import IncomingFriendRequestRow from "./IncomingFriendRequestRow";
import OutgoingFriendRequestRow from "./OutgoingFriendRequestRow";
import { useRouter } from "next/navigation";

export interface FriendRequestProps {
  id: string;
  sender_id: string;
  sender_image: string;
  sender_first_name: string;
  sender_last_name: string;
  receiver_id: string;
  receiver_image: string;
  receiver_first_name: string;
  receiver_last_name: string;
  sent_date_time: number;
  status: RequestStatus;
}

export enum RequestStatus {
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
}

const FriendRequestDisplay = (props: { selectedTab: FriendRequestTab }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [incomingRequests, setIncomingRequests] = useState<
    FriendRequestProps[]
  >([]);
  const [outgoingRequests, setOutgoingRequests] = useState<
    FriendRequestProps[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function fetchFriendRequest() {
    let res;
    try {
      const requestType = props.selectedTab.toString();
      res = await fetch(
        `/friends/friend-requests/api?page=${currentPage}&type=${requestType}`,
        {
          method: "GET",
        }
      );
      
      if(res.status !== 200) {
        throw new Error("Failed to fetch friend requests");
      }

      const data = await res.json();
      if (data.body.statusCode === 200) {
        // setFriends(data.body.data.result);
        requestType === FriendRequestTab.INCOMING.toString() &&
          setIncomingRequests(data.body.data.result);
        requestType === FriendRequestTab.OUTGOING.toString() &&
          setOutgoingRequests(data.body.data.result);
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
    fetchFriendRequest().then((data) => {
      setIsLoading(false);
    });
  }, [props.selectedTab]);

  if (isLoading) {
    return <FriendRequestDisplayLoading />;
  }

  return (
    <ScrollArea>
      <section className="size-full flex flex-col">
        <div className="mb-[10px] w-[96%] h-[40px] pl-[14px] text-gray-2 self-center flex flex-col justify-end">
          Pending:
        </div>
        {props.selectedTab === FriendRequestTab.INCOMING &&
          incomingRequests.map((request) => {
            if (request.status === RequestStatus.PENDING.toString())
              return (
                <IncomingFriendRequestRow key={request.id} request={request} />
              );
          })}
        {props.selectedTab === FriendRequestTab.OUTGOING &&
          outgoingRequests.map((request) => {
            if (request.status === RequestStatus.PENDING.toString())
              return (
                <OutgoingFriendRequestRow key={request.id} request={request} />
              );
          })}
      </section>
    </ScrollArea>
  );
};

export default FriendRequestDisplay;
