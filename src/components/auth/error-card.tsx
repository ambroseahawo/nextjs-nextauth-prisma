import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { CardWrapper } from "@/components/auth/card-wrapper";

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="w-full flex justify-center items-center">
        <ExclamationTriangleIcon className="text-destructive" />
      </div>
    </CardWrapper>
    // <Card className="w-[400px] shadow-md">
    //   <CardHeader>
    //     <Header label="Oops! Something went wrong" />
    //   </CardHeader>
    //   <CardFooter>
    //     <BackButton label="Back to login" href="/auth/login" />
    //   </CardFooter>
    // </Card>
  );
};
