"use client";
import { cn } from "@/lib/utils";
import { sendFriendRequest } from "@/services/FriendRequestService";
import { useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

export interface SendFriendRequestMessage {
  message?: string[];
  isSuccess?: boolean;
}

const initialState = {
  message: [""],
};

function SubmitButton(props: { isClickable: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={cn(
        "bg-blue-2 h-[32px] text-nowrap px-[16px] py-[2px] rounded-[3px] ",
        "text-[14px] text-white flex flex-row justify-center self-center ",
        props.isClickable &&
          "transition duration-150 ease-out hover:ease-in hover:bg-purple-1 ",
        !props.isClickable && "text-gray-1 bg-blue-3 cursor-not-allowed"
      )}
      aria-disabled={!pending && !props.isClickable}
      disabled={!pending && !props.isClickable}
    >
      <div className="m-auto">Send Friend Request</div>
    </button>
  );
}

const AddFriend = () => {
  const [state, formAction] = useFormState(sendFriendRequest, initialState);
  const [hasInput, setHasInput] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  if (formRef.current && state.isSuccess) {
    state.isSuccess === undefined;
    formRef.current.reset();
  }

  return (
    <form
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
            onChange={(e) => {
              if (e.target.value.length > 0 && !hasInput) setHasInput(true);
              else if (e.target.value.length === 0 && hasInput)
                setHasInput(false);
            }}
            placeholder="You can add friends with their usernames or emails."
          ></input>
        </div>
        <SubmitButton isClickable={hasInput} />
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
    </form>
  );
};

export default AddFriend;
