// src/pages/ErrorPage.tsx
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  console.error(error);

  let title = "Oops!";
  let message = "Something went wrong.";

  if (isRouteErrorResponse(error)) {
    // Ako je error od React Router-a (404, 500...)
    title = `${error.status} ${error.statusText}`;
    message = error.data?.message || message;
  } else if (error instanceof Error) {
    // Ako je običan JS error
    message = error.message;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{title}</h1>
      <p>{message}</p>
      <a href="/">Go back to Home</a>
    </div>
  );
};

export default ErrorPage;
