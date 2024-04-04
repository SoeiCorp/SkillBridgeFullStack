import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from "@/lib/prisma";
import { reqBody } from "./postBody";

async function validateJobOwner(employerId: string, jobId: string) {
    try {
        const job = await prisma.job.findUniqueOrThrow({
            where: {
                id: jobId
            },
            select: {
                employerId: true
            }
        });

        return job.employerId === employerId;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function studentApplicationExists(jobId: string, studentId: string) {
    try {
        const application = await prisma.application.findUniqueOrThrow({
            where: {
                userId_jobId: {
                    userId: studentId,
                    jobId: jobId,
                }
            }
        });

        return true;
    } catch (err) {
        console.log("application", err);
        return false;
    }
}

function validateRequestBody(jobId: string, studentId: string, stars: number, description: string) {
    const requestBodyArray = [jobId, studentId, stars, description];

    for (let i=0; i<requestBodyArray.length; i++) {
        const element = requestBodyArray[i];
        if (element === undefined || element === null) {
            return false;
        }
    }

    if (stars < 0 || stars > 5) {
        return false;
    }

    return true;
}

export async function POST(req: Request) {
    const reqBody: reqBody = await req.json();

    const { jobId, studentId, stars, description } = reqBody;

    if (!validateRequestBody(jobId, studentId, stars, description)) {
        return Response.json({
            success: false,
            message: "Please provide jobId, studentId, stars and description"
        }, {
            status: 400
        });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
        return Response.json({
            success: false,
            message: "Session not found"
        }, {
            status: 401
        });
    }

    const employerId = session.user.id;

    const validJobOwner = await validateJobOwner(employerId, jobId);
    if (!validJobOwner) {
        return Response.json({
            success: false,
            message: "Invalid job owner"
        }, {
            status: 401
        });
    }

    const applicationExists = studentApplicationExists(jobId, studentId);
    if (!applicationExists) {
        return Response.json({
            success: false,
            message: "Application does not exists"
        }, {
            status: 401
        });
    }
    
    try {
        await prisma.review.create({
            data: {
                jobId: jobId,
                description: description,
                studentId: studentId,
                stars: stars
            }
        });
    } catch(err) {
        console.log(err);
        return Response.json({
            success: false,
            message: "Failed to create a new review"
        }, {
            status: 500
        });
    }

    return Response.json({
        success: true,
        message: "Successfully create a review",
    });
}