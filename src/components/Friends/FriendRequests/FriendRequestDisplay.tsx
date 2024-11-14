import { FriendRequestTab } from "@/types/ui";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import FriendRequestDisplayLoading from "./FriendRequestDisplayLoading";
import IncomingFriendRequestRow from "./IncomingFriendRequestRow";
import OutgoingFriendRequestRow from "./OutgoingFriendRequestRow";
import { useRouter } from "next/navigation";
import AddFriend from "./AddFriend";
import { FriendRequest, FriendRequestStatus } from "@/types/friendrequest";

const FriendRequestDisplay = (props: { selectedTab: FriendRequestTab }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function fetchFriendRequest() {
    let res;
    try {
      const requestType = props.selectedTab.toString();
      if (requestType === FriendRequestTab.ADD_FRIEND) return;
      res = await fetch(
        `/dashboard/api/friend-request?page=${currentPage}&type=${requestType}`,
        {
          method: "GET",
        }
      );

      if (res.status !== 200) {
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
        {props.selectedTab === FriendRequestTab.INCOMING && (
          <div>
            <div className="mb-[10px] w-[96%] h-[40px] pl-[14px] text-gray-2 self-center flex flex-col justify-end">
              Pending: {incomingRequests.length}
            </div>{" "}
            {incomingRequests.map((request) => {
              if (request.status === FriendRequestStatus.PENDING.toString())
                return (
                  <IncomingFriendRequestRow
                    key={request.id}
                    request={request}
                  />
                );
            })}
          </div>
        )}
        {props.selectedTab === FriendRequestTab.OUTGOING && (
          <div>
            <div className="mb-[10px] w-[96%] h-[40px] pl-[14px] text-gray-2 self-center flex flex-col justify-end">
              Pending: {outgoingRequests.length}
            </div>{" "}
            {outgoingRequests.map((request) => {
              if (
                request.status === FriendRequestStatus.PENDING.toString() ||
                request.status === FriendRequestStatus.REJECTED.toString()
              )
                return (
                  <OutgoingFriendRequestRow
                    key={request.id}
                    request={request}
                  />
                );
            })}
          </div>
        )}
        {props.selectedTab === FriendRequestTab.ADD_FRIEND && <AddFriend />}
      </section>
    </ScrollArea>
  );
};

export default FriendRequestDisplay;
