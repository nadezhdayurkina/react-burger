import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "../store/index.ts";

type TProtectedProps = {
  onlyUnAuth?: boolean;
  component: React.JSX.Element;
  requiredReferrer?: string | null;
};

export const Protected = ({
  onlyUnAuth = false,
  component,
  requiredReferrer = null,
}: TProtectedProps): React.JSX.Element => {
  const userStore = useUserStore();
  const location = useLocation();

  if (!userStore.isAuthChecked) {
    return <p>Загрузка...</p>;
  }

  if (onlyUnAuth && userStore.name) {
    const { from } = location.state ?? { from: { pathname: "/ " } };
    return <Navigate to={from} />;
  }

  if (!onlyUnAuth && !userStore.name) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (requiredReferrer && location.state?.from !== requiredReferrer) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return component;
};

export const OnlyAuth = Protected;
export const OnlyUnAuth = ({
  component,
  requiredReferrer,
}: {
  component: React.JSX.Element;
  requiredReferrer?: string;
}): React.JSX.Element => (
  <Protected
    onlyUnAuth={true}
    component={component}
    requiredReferrer={requiredReferrer}
  />
);
