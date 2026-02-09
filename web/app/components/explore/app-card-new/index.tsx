"use client";
import cn from "classnames";
import type { App } from "@/models/explore";
import AppIcon from "@/app/components/base/app-icon";
import s from "../app-list/style.module.css";

export type AppCardProps = {
  app: App;
  canCreate: boolean;
  onCreate: () => void;
  isExplore: boolean;
  onExplore: () => void;
};

const AppCard = ({ app, isExplore, onExplore }: AppCardProps) => {
  const { app: appBasicInfo } = app;
  return (
    <div
      onClick={() => {
        onExplore();
      }}
      className={cn(
        s.shadowLg,
        "group col-span-1 flex min-h-[160px] cursor-pointer flex-col rounded-lg border-2 border-solid border-transparent bg-white shadow-md transition-all duration-200 ease-in-out",
      )}
    >
      <div
        className={cn(
          s.h100,
          "flex h-[66px] shrink-0 grow-0 items-center gap-3 px-[14px] pb-3 pt-[14px]",
        )}
      >
        <div className="relative shrink-0">
          {isExplore ? (
            <img src={app.app.icon} style={{ width: 100, height: 100 }} />
          ) : (
            <AppIcon
              size="large"
              icon={app.app.icon}
              background={app.app.icon_background}
            />
          )}
        </div>
        <div className={cn(s.h78, "w-0 grow py-[1px] ")}>
          <div className="marg-b12 flex items-center text-[16px] font-semibold leading-5 text-gray-800">
            <div className="truncate" title={appBasicInfo.name}>
              {appBasicInfo.name}
            </div>
          </div>
          <div className="flex items-center text-[10px] font-medium leading-[18px] text-gray-500">
            <div className="mb-1 line-clamp-3 text-xs leading-normal text-gray-500">
              {appBasicInfo.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppCard;
