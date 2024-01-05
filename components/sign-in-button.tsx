import { useSignInModal } from "./sign-in-modal";
import { Button } from "./ui/button";

export const SignInButton = () => {
  const { SignInModal, setShowSignInModal } = useSignInModal();
  return (
    <>
      <SignInModal />
      <Button
        variant={"default"}
        className="p-8 rounded-full"
        onClick={() => setShowSignInModal(true)}
      >
        Sign In to try the example
      </Button>
    </>
  );
};
