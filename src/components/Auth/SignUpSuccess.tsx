interface UnactivatedAccountProps {
  email: string;
}

const SignUpSuccess = (props: UnactivatedAccountProps) => {
  return (
    <section className="w-full p-[36px] h-fit max-sm:p-[20px]">
      <div className="mb-[20px]">
        <h1 className="text-white text-[36px] max-sm:text-[26px]">
          Thank you for signing up
        </h1>
        <p className="text-white text-[20px] max-sm:text-[16px]">
          We sent an email to{" "}
          <span className="text-green-400">{props.email}</span>. Please check the it to activate account and get started.
        </p>
        <button
          type="submit"
          className="mt-[20px] bg-blue-2 h-[40px] w-full rounded-md text-white  mb-[8px] flex flex-row justify-center
          transition duration-150 ease-out hover:ease-in hover:bg-purple-1"
        >
          <div className="m-auto">Back to Login</div>
        </button>
      </div>
    </section>
  );
};

export default SignUpSuccess;
