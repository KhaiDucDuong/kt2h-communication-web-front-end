"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { sendFriendRequest } from "@/services/FriendRequestService";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import debounce from "lodash.debounce";
import { getCurrentUser } from "@/services/UserService";
export interface SendFriendRequestMessage {
  message?: string[];
  isSuccess?: boolean;
}

const initialState = {
  message: [""],
};

function SubmitButton(props: { isClickable: boolean, isRequestSent: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={cn(
        "h-[32px] text-nowrap px-[16px] py-[2px] rounded-[3px] ",
        "text-[14px] text-white flex flex-row justify-center self-center ",
        !props.isRequestSent && props.isClickable && 
          "bg-blue-2 transition duration-150 ease-out hover:ease-in hover:bg-purple-1 ",
        props.isRequestSent && "bg-gray-600 text-white-500 cursor-not-allowed",
        !props.isClickable && !props.isRequestSent && "bg-blue-3 cursor-not-allowed"
      )}
      aria-disabled={!pending && !props.isClickable || props.isRequestSent}
      disabled={!pending && !props.isClickable || props.isRequestSent}
    >
      <div className="m-auto">
        {props.isRequestSent ? "Request Sent" : "Send Friend Request"}
      </div>
    </button>
  );
}

const AddFriend = () => {

  const [state, formAction] = useFormState(sendFriendRequest, initialState);
  const [searchUser, setsearchUser] = useState([]);
  const [isRequestSent, setIsRequestSent] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);

  const handleSearch = useCallback(async (searchTerm: any) => {
    if(searchTerm != "") {
      let res;
    const user = await getCurrentUser();
      try {
        res = await fetch(`/dashboard/api/search?username=${searchTerm}&currentId=${user?.user_id}`, {
          method: "GET",
        });
  
        if (res.status !== 200) {
          throw new Error("Failed to fetch user search list");
        }
  
        const data = await res.json();
        if (data.response.statusCode === 200) {
           setsearchUser(data.response.data);
           setIsRequestSent(false);
           console.log(searchUser)
        } 
      } catch (error) {
        console.log("Error: " + error);
      }
    }
    else setsearchUser([]);
  }, []);

   const debouncedSearch = useMemo(() => {
    return debounce(handleSearch, 500);
  }, [handleSearch]);

  const handleChange = (e) => {
    if (e.target.value.length > 0) {
      debouncedSearch(e.target.value);
    }
    else if (e.target.value.length === 0)
    {
    debouncedSearch("");
    }
    if (formRef.current && state.isSuccess) {
      state.isSuccess === undefined;
    }
  };
  const handleSendRequest = async (username: string) => {
    const formData = new FormData();
    await formData.append("receiver_username", username); 
    formRef.current?.reset();
    setIsRequestSent(true);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); 
    }
  };
  useEffect(() => {
    if (state.isSuccess !== undefined) {
      setIsRequestSent(true); 
    }
  }, [state.isSuccess]);
  return (
    <form
      onKeyDown={handleKeyDown}
      action={formAction}
      autoComplete="off"
      ref={formRef}
      className="px-[14px] py-[14px] min-h-fit"
    >
      <h2 className="text-[18px] text-gray-2 font-bold uppercase mb-[8px]">
        ADD FRIEND
      </h2>
      <p className="text-[16px] text-gray-5">
        You can add friends with their usernames or emails.
      </p>
      <div
        className={cn(
          "mt-[16px] px-[12px] border-[1px] flex flex-row justify-between rounded-[8px] border-gray-5",
          state.isSuccess && "border-green-500 ",
          state.isSuccess === false && "border-red-500 "
        )}
      >
        <div className="py-[4px] w-full mr-[16px]">
          <input
            className="h-[40px] bg-transparent w-full text-gray-2
              focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2"
            type="text"
            name="receiver_username"
            maxLength={255}
            onChange={handleChange}
            placeholder="You can add friends with their usernames or emails."
          ></input>
        </div>
      </div>
      {state.isSuccess !== undefined && (
        <div
          className={cn(
            "mt-[4px] ml-[2px] text-[14px] ",
            state.isSuccess && "text-green-400 ",
            !state.isSuccess && "text-red-400"
          )}
        >
          {state.message}
        </div>
      )}
      {searchUser.length > 0 && (
        <div className="mt-[8px] p-[4px] bg-dark-4 border-0 rounded">
          <h3 className="text-gray-2 font-bold mb-[4px]">Results:</h3>
          <ul>
            {searchUser.map((user) => (
                           <li key={user.user_id} className="flex items-center justify-between p-[8px] border-0 last:border-0 text-white">
                           <div className="flex items-center">
                           <Image
                              src={user.image ? user.image : "/assets/images/group-chat-default.png"}
                              alt="user's image"
                              width={50}
                              height={50}
                              className="w-[50px] h-[50px] rounded-full mr-4"
                            />
                             <span>{user.user_name} - {user.last_name} {user.first_name} </span>
                           </div>
                           {user.is_Friend == '0' ? (
                  <SubmitButton
                    isClickable={!isRequestSent} 
                    onClick={() => handleSendRequest(user.user_name)}
                    isRequestSent ={isRequestSent}
                  />
                ) : (
                  <span className="text-green-500">Already a friend</span>
                )}
                         </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  )
};

export default AddFriend;
