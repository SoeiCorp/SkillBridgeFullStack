import {
    deliveredToInProgress,
    deliveredToWagePaymentPending,
} from "@/actions/jobs/jobCards/employerChangeApplicationState";
import Image from "next/image";

export default function ApproveButton({
    studentId,
    jobId,
}: {
    studentId: string;
    jobId: string;
}) {
    return (
        <div className="flex justify-end">
            <div className="w-1/2 flex justify-between mt-[10px] xl:mt-0">
                <button
                    className="h-[35px] bg-red-500 text-sm text-white rounded-md w-[32%] hover:opacity-80 active:opacity-60"
                    onClick={async () => {
                        await deliveredToInProgress(studentId, jobId);
                        location.reload();
                    }}
                >
                    ไม่รับมอบงาน
                </button>
                <button
                    className="h-[35px] bg-[#334155] text-sm text-white rounded-md w-[32%] hover:opacity-80 active:opacity-60"
                    onClick={async () => {
                        await deliveredToWagePaymentPending(studentId, jobId);
                        location.reload();
                    }}
                >
                    รับมอบงาน
                </button>
                <button className="h-[35px] bg-[#f8fafc] text-sm  rounded-md w-[32%] hover:opacity-80 active:opacity-60 text-black border border-[#334155] flex justify-center items-center">
                    <Image
                        src={"/icons/chat.svg"}
                        alt="chat"
                        width={13}
                        height={13}
                        className="mr-[3px]"
                    />
                    <p className="text-[#334155]">แชท</p>
                </button>
            </div>
        </div>
    );
}
