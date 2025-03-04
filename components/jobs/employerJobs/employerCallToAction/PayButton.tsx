import Link from "next/link";
import ProgressButton from "../ProgressButton";

export default function PayButton({
    studentId,
    jobId,
}: {
    studentId: string;
    jobId: string;
}) {
    return (
        <div className="flex flex-row justify-between">
            <ProgressButton jobId={jobId} studentId={studentId} />
            <div className="w-1/2 flex justify-end">
                <Link
                    href={`/jobs/${jobId}/payment/${studentId}`}
                    className="h-[35px] w-[48%] bg-[#334155] text-sm text-white rounded-md hover:opacity-80 active:opacity-60 flex justify-center items-center"
                >
                    จ่ายเงิน
                </Link>
            </div>
        </div>
    );
}
