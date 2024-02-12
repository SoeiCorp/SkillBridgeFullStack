"use server";
import prisma from "../db/prisma";
import cloudinary from "../lib/bucket";
//import {getServerSession} from "next-auth";
//import {options} from "../api/auth/[...nextaut]/options"

interface FormData {
  employerId: string;
  title: string;
  description: string;
  budget: number;
  numWorker: number;
  estimateStartDate: Date;
  estimateEndDate: Date;
  jobTagId: string;
  files?: File;
}

const createJob = async (formData: FormData) => {
  try {
    const employerId = formData.employerId;
    const title = formData.title;
    const status = "NOT_STARTED"; //ไม่น่าใช่ input จาก user เราคง้องกำหนดเอง
    const description = formData.description;
    const estimateStartDate = formData.estimateStartDate as Date;
    const estimateEndDate = formData.estimateEndDate as Date;
    const budget = formData.budget;
    const jobTagId = formData.jobTagId;
    const numWorker = formData.numWorker;
    const files = formData.files as File;
    console.log(
      title,
      status,
      description,
      estimateStartDate,
      estimateEndDate,
      budget,
      jobTagId,
      numWorker,
      files
    );
    //const session = await getServerSession(options);
    //const userId = session?.userId
    // const employer = await prisma.employer.findFirst({
    //   where:{ userId: userId},
    //   select:{userId:true}
    // })

    // if (!session || !employer){
    //   throw {
    //     message: "Authentication fail",
    //     status: 401
    //   }
    // }

    if (files?.size >= 1024 * 1024 * 10 || files?.type != "application/pdf") {
      throw {
        message: "Invalid file format or file is too large.",
      };
    }
    const arrayBuffer = await files?.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "test", format: "pdf" },
          function (error, result) {
            if (error) {
              reject(error);
              return;
            }
            resolve(result);
          }
        )
        .end(buffer);
    });
    await prisma.job.create({
      data: {
        employerId: employerId,
        title: title,
        status: status,
        description: description,
        estimateStartDate: estimateStartDate,
        estimateEndDate: estimateEndDate,
        budget: budget,
        numWorker: numWorker,
        jobTagId: jobTagId,
      },
    });

    return {
      message: "Create Task Success",
      status: 201,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: error.message || "Internal Server Error",
      status: error.status || 500,
    };
  }
};

export default createJob;

const main = async () => {
  const data = {
    employerId: "d5a22b3d-49dc-4f55-acfd-88a78d88ada5",
    title: "Test work",
    description: "test description",
    estimateStartDate: new Date().toISOString(),
    estimateEndDate: new Date().toISOString(),
    budget: 1000,
    numWorker: 1,
    jobTagId: "0ec26b18-7954-460c-895e-6838b72c77cd",
    files: null,
  } as unknown as FormData;
  const result = await createJob(data);
};

main();
