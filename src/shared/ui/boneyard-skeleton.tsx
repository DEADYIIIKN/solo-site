"use client";

import { Skeleton } from "boneyard-js/react";

type BoneyardSkeletonProps = {
  children: React.ReactNode;
  loading: boolean;
  name: string;
};

export function BoneyardSkeleton({
  children,
  loading,
  name,
}: BoneyardSkeletonProps) {
  return (
    <Skeleton
      animate="shimmer"
      fallback={
        <div
          className="absolute inset-0 animate-pulse bg-[#ebe5df] dark:bg-[#231815]"
          style={{ borderRadius: "inherit" }}
        />
      }
      loading={loading}
      name={name}
      transition={220}
    >
      {children}
    </Skeleton>
  );
}
