import React from "react";
import { AuthLayoutWithCard } from "../../../layouts/AuthLayout";

export const ResetPageLayout = ({ title, description, success, successMessage, children }: any) => {
    return (
      <AuthLayoutWithCard
        title={title}
        description={description}
        footer={
          <p>
            Need help?{' '}
            <a target="_blank" rel="noopener noreferrer">
              Contact us!
            </a>
          </p>
        }
      >
        {success ? <div style={{ paddingTop: 20, paddingBottom: 20 }}>{successMessage} </div> : children}
      </AuthLayoutWithCard>
    );
  };