import FriendListHeader from "@/components/Friends/FriendList/FriendListHeader";
import FriendListDisplay from "@/components/Friends/FriendList/FriendListDisplay";

const FriendList = () => {
  return (
    <section className="flex flex-col size-full bg-dark-4">
      <div className="h-[98px]">
        <FriendListHeader />
      </div>
      <FriendListDisplay />
    </section>
  );
};

export default FriendList;
