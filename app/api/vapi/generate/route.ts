import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export async function POST(request: Request) {
    try {
        const { type, role, level, techstack, amount, userid } = await request.json();

        const { text: questions } = await generateText({
            model: google('gemini-2.5-flash'),
            prompt: `Prepare questions for a job interview.
            The job role is ${role}.
            The job experience level is ${level}.
            The tech stack used in the job is: ${techstack}.
            The focus between behavioural and technical questions should lean towards: ${type}.
            The amount of questions required is: ${amount}.
            
            IMPORTANT: Return a VALID JSON array of strings only. 
            Do not include Markdown formatting like \`\`\`json or \`\`\`.
            Do not include any introductory text.
            
            Example format:
            ["Question 1", "Question 2", "Question 3"]
            `,
        });

        // Clean the response just in case the AI adds markdown blocks
        const cleanedText = questions.replace(/```json/g, '').replace(/```/g, '').trim();

        const interview = {
            role,
            type,
            level,
            techstack: techstack.split(','),
            questions: JSON.parse(cleanedText),
            userId: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
        }

        await db.collection("interviews").add(interview);

        return Response.json({ success: true, id: interview.userId }, { status: 200 });

    } catch (error) {
        console.error("Error generating interview:", error);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}