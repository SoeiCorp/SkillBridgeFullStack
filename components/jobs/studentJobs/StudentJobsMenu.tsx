"use client";

import React, { useEffect, useState } from "react";
import JobToggler from "../JobToggler";
import Sorter from "../Sorter";
import StudentJobsPanel from "./StudentJobsPanel";
import filterStudentJobs from "@/lib/Jobs/filterJobToggler";
import StudentDoneJobsPanel from "./StudentDoneJobsPanel";
import {
    applicationInfo,
    studentFetchApplications,
} from "@/actions/jobs/jobCards/fetchJobCards";

type Props = {};

// List of job types feeding Toggle component
const jobTypeList = ["งานที่กำลังสมัคร", "งานปัจจุบัน", "งานที่เสร็จสิ้น"];

const StudentJobsMenu = (props: Props) => {
    const [jobType, setJobType] = useState("งานที่กำลังสมัคร");
    const [isOpeningSideBar, setIsOpeningSideBar] = useState(false);
    const [startDateSortOption, setStartDateSortOption] = useState("-");
    const [endDateSortOption, setEndDateSortOption] = useState("-");
    const [statusSortOption, setStatusSortOption] = useState("-");
    const [firstPageData, setFirstPageData] = useState<Array<applicationInfo>>(
        []
    );
    const [secondPageData, setSecondPageData] = useState<
        Array<applicationInfo>
    >([]);
    const [thirdPageData, setThirdPageData] = useState<Array<applicationInfo>>(
        []
    );
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Fetch data from the server
    useEffect(() => {
        async function fetchData() {
            const fetchedRawData = await studentFetchApplications();
            setFirstPageData(fetchedRawData[0] as applicationInfo[]);
            setSecondPageData(fetchedRawData[1] as applicationInfo[]);
            setThirdPageData(fetchedRawData[2] as applicationInfo[]);
            setIsLoading(false);
        }
        fetchData();
    }, []);

    // Sort the data based on the options provided
    const sortOptions = [
        {
            name: "วันที่เริ่มต้น",
            value: startDateSortOption,
            set: setStartDateSortOption,
        },
        {
            name: "วันที่สิ้นสุด",
            value: endDateSortOption,
            set: setEndDateSortOption,
        },
        { name: "สถานะ", value: statusSortOption, set: setStatusSortOption },
    ];

    return (
        <>
            {/* Toggle between PendingJobsPanel and DoneJobsPanel based on the value of isPending. */}
            <JobToggler
                status={jobType}
                setStatus={setJobType}
                statusList={jobTypeList}
            />

            {/* Sort button */}
            <section className="my-3">
                <div className="flex flex-row gap-2 justify-end">
                    {/* This is made to contain height consistency */}
                    <div className="bg-transparent text-transparent py-2">
                        |
                    </div>

                    {/* Sort button */}
                    <Sorter
                        sideBarState={{
                            name: "sidebar",
                            value: isOpeningSideBar,
                            set: setIsOpeningSideBar,
                        }}
                        sortOptions={sortOptions}
                    />
                </div>
            </section>

            {/* show jobs */}
            <div>
                {/* applied, current, done jobs */}
                {jobType === "งานที่กำลังสมัคร" ? (
                    <StudentJobsPanel
                        isLoading={isLoading}
                        startDateSortOption={startDateSortOption}
                        endDateSortOption={endDateSortOption}
                        statusSortOption={statusSortOption}
                        data={firstPageData}
                        isDone={false}
                    />
                ) : jobType === "งานปัจจุบัน" ? (
                    <StudentJobsPanel
                        isLoading={isLoading}
                        startDateSortOption={startDateSortOption}
                        endDateSortOption={endDateSortOption}
                        statusSortOption={statusSortOption}
                        data={secondPageData}
                        isDone={false}
                    />
                ) : (
                    <StudentJobsPanel
                        isLoading={isLoading}
                        startDateSortOption={startDateSortOption}
                        endDateSortOption={endDateSortOption}
                        statusSortOption={statusSortOption}
                        data={thirdPageData}
                        isDone={true}
                    />
                )}
            </div>
        </>
    );
};

export default StudentJobsMenu;
