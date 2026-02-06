"use client";

// Libraries
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useBoolean, useDebounceFn } from "ahooks";
import { useQuery } from "@tanstack/react-query";

// Components
import ExternalAPIPanel from "../../components/datasets/external-api/external-api-panel";
import Datasets from "./datasets";
import DatasetFooter from "./dataset-footer";
import ApiServer from "../../components/develop/ApiServer";
import Doc from "./doc";
import TabSliderNew from "@/app/components/base/tab-slider-new";
import TagManagementModal from "@/app/components/base/tag-management";
import TagFilter from "@/app/components/base/tag-management/filter";
import Button from "@/app/components/base/button";
import Input from "@/app/components/base/input";
import { ApiConnectionMod } from "@/app/components/base/icons/src/vender/solid/development";
import CheckboxWithLabel from "@/app/components/datasets/create/website/base/checkbox-with-label";

// Services
import { fetchDatasetApiBaseUrl } from "@/service/datasets";

// Hooks
import { useTabSearchParams } from "@/hooks/use-tab-searchparams";
import { useStore as useTagStore } from "@/app/components/base/tag-management/store";
import { useAppContext } from "@/context/app-context";
import { useExternalApiPanel } from "@/context/external-api-panel-context";
import { useGlobalPublicStore } from "@/context/global-public-context";
import useDocumentTitle from "@/hooks/use-document-title";
import Link from "next/link";

const Container = () => {
  const { t } = useTranslation();
  const { systemFeatures } = useGlobalPublicStore();
  const router = useRouter();
  const { currentWorkspace, isCurrentWorkspaceOwner } = useAppContext();
  const showTagManagementModal = useTagStore((s) => s.showTagManagementModal);
  const { showExternalApiPanel, setShowExternalApiPanel } =
    useExternalApiPanel();
  const [includeAll, { toggle: toggleIncludeAll }] = useBoolean(false);
  useDocumentTitle(t("dataset.knowledge"));

  const options = useMemo(() => {
    return [
      { value: "dataset", text: t("dataset.datasets") },
      ...(currentWorkspace.role === "dataset_operator"
        ? []
        : [{ value: "api", text: t("dataset.datasetsApi") }]),
    ];
  }, [currentWorkspace.role, t]);

  const [activeTab, setActiveTab] = useTabSearchParams({
    defaultTab: "dataset",
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const { data } = useQuery({
    queryKey: ["datasetApiBaseInfo"],
    queryFn: () => fetchDatasetApiBaseUrl("/datasets/api-base-info"),
    enabled: activeTab !== "dataset",
  });

  const [keywords, setKeywords] = useState("");
  const [searchKeywords, setSearchKeywords] = useState("");
  const { run: handleSearch } = useDebounceFn(
    () => {
      setSearchKeywords(keywords);
    },
    { wait: 500 },
  );
  const handleKeywordsChange = (value: string) => {
    setKeywords(value);
    handleSearch();
  };
  const [tagFilterValue, setTagFilterValue] = useState<string[]>([]);
  const [tagIDs, setTagIDs] = useState<string[]>([]);
  const { run: handleTagsUpdate } = useDebounceFn(
    () => {
      setTagIDs(tagFilterValue);
    },
    { wait: 500 },
  );
  const handleTagsChange = (value: string[]) => {
    setTagFilterValue(value);
    handleTagsUpdate();
  };

  useEffect(() => {
    if (currentWorkspace.role === "normal") return router.replace("/apps");
  }, [currentWorkspace, router]);

  return (
    <div
      ref={containerRef}
      className={`scroll-container relative flex grow flex-col overflow-y-auto rounded-t-xl outline-none ${activeTab === "dataset" ? "bg-background-body" : "bg-components-panel-bg"}`}
    >
      <div
        className={`sticky top-0 z-10  shrink-0  gap-y-2 rounded-t-xl px-6 py-2 ${activeTab === "api" ? "border-b border-solid border-b-divider-regular" : ""} ${activeTab === "dataset" ? "bg-background-body" : "bg-components-panel-bg"}`}
      >
        <div className="" style={{ fontSize: "24px", marginBottom: "20px" }}>
          知识库
        </div>
        <div className="flex flex-wrap items-end justify-between">
          <div>
            <TabSliderNew
              value={activeTab}
              onChange={(newActiveTab) => setActiveTab(newActiveTab)}
              options={options}
            />
            <div className="flex gap-3 pt-4">
              <Link
                href="/datasets/create"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                创建知识库
              </Link>

              <Link
                href="/datasets/connect"
                className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                连接外部知识库
              </Link>
            </div>
          </div>
          {activeTab === "dataset" && (
            <div className="flex items-center justify-center gap-2">
              {isCurrentWorkspaceOwner && (
                <CheckboxWithLabel
                  isChecked={includeAll}
                  onChange={toggleIncludeAll}
                  label={t("dataset.allKnowledge")}
                  labelClassName="system-md-regular text-text-secondary"
                  className="mr-2"
                  tooltip={t("dataset.allKnowledgeDescription") as string}
                />
              )}
              <TagFilter
                type="knowledge"
                value={tagFilterValue}
                onChange={handleTagsChange}
              />
              <Input
                showLeftIcon
                showClearIcon
                wrapperClassName="w-[200px]"
                value={keywords}
                onChange={(e) => handleKeywordsChange(e.target.value)}
                onClear={() => handleKeywordsChange("")}
              />
              <div className="h-4 w-[1px] bg-divider-regular" />
              <Button
                className="shadows-shadow-xs gap-0.5"
                onClick={() => setShowExternalApiPanel(true)}
              >
                <ApiConnectionMod className="h-4 w-4 text-components-button-secondary-text" />
                <div className="system-sm-medium flex items-center justify-center gap-1 px-0.5 text-components-button-secondary-text">
                  {t("dataset.externalAPIPanelTitle")}
                </div>
              </Button>
            </div>
          )}
          {activeTab === "api" && data && (
            <ApiServer apiBaseUrl={data.api_base_url || ""} />
          )}
        </div>
      </div>
      {activeTab === "dataset" && (
        <>
          <Datasets
            containerRef={containerRef}
            tags={tagIDs}
            keywords={searchKeywords}
            includeAll={includeAll}
          />
          {/* {!systemFeatures.branding.enabled && <DatasetFooter />} */}
          {showTagManagementModal && (
            <TagManagementModal
              type="knowledge"
              show={showTagManagementModal}
            />
          )}
        </>
      )}
      {activeTab === "api" && data && (
        <Doc apiBaseUrl={data.api_base_url || ""} />
      )}

      {showExternalApiPanel && (
        <ExternalAPIPanel onClose={() => setShowExternalApiPanel(false)} />
      )}
    </div>
  );
};

export default Container;
