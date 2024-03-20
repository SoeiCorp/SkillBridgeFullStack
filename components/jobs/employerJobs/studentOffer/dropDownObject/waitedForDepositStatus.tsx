import Router from "next/router";

export default function WaitedForDepositStatus({
  studentId,
  jobId,
}: {
  studentId: string;
  jobId: string;
}) {
  return (
    <div className="w-[330px] flex justify-between mt-[10px] xl:mt-0">
      <button
        className="h-[35px] bg-[#334155] text-sm text-white rounded-md w-[100%] hover:opacity-80 active:opacity-60"
        onClick={() => {
          /* call function ของ little เพื่อจ่ายค่ามัจจำ*/
        }}
      >
        จ่ายเงิน
      </button>
    </div>
  );
}
