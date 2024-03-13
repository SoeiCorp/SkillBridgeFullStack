"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from "@/lib/prisma";
import { float } from "@elastic/elasticsearch/lib/api/types";
import uploadFileToS3 from "../../lib/S3/uploadFileToS3";

const acceptedType = "application/pdf";

const createApplication = async (formData: FormData) => {
  try {
    const session: any = await getServerSession(authOptions);
    const userId = session?.user.id;
    const student = await prisma.student.findFirst({
      where: { userId: userId },
      select: { userId: true },
    });

    if (!session || !student) {
      throw {
        message: "Not Authenticated",
        status: 401,
      };
    }

    const file = formData.get("file") as File;
    const bid = formData.get("bid") as unknown as number;
    const jobID = formData.get("jobID") as string;

    if (file.size > 1024 * 1024 * 5) {
      throw {
        message: "Files are too large",
      };
    }

    if (file.type !== acceptedType) {
      throw {
        message: "Invalid File Type",
      };
    }
    const buffer = new Uint8Array(await file.arrayBuffer());
    const fileName: string | any = await uploadFileToS3(
      buffer,
      file.type,
      file.size,
      "/applicationFiles"
    );

    if (fileName.message) {
      throw fileName;
    }
    const appDocs: any = await prisma.applicationDocumentFile.create({
      data: {
        applicationUserId: session.user.id,
        applicationJobId: jobID,
        fileName: fileName,
      },
    });

    const application = await prisma.application.create({
      data: {
        userId: session.user.id,
        jobId: jobID,
        bid: bid,
        applicationDocumentFiles: appDocs,
      },
    });

    const successResponse = {
      message: "Create Application Success",
      status: 201,
    };
    return successResponse;
  } catch (error: any) {
    console.log(error);
    return {
      message: error.message || "Internal Server Error",
      status: error.status || 500,
    };
  }
};
export default createApplication;

// const main = async () => {
//   uploadFileToS3("jobFiles");
// };

// main();
