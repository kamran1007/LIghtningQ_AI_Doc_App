// app/api/users/route.ts
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const payload: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        payload[key] = {
          name: value.name,
          type: value.type,
          size: value.size,
        };
      } else {
        payload[key] = value;
      }
    }

    console.log("✅ Received Payload:", payload);

    return Response.json({ message: "User data received", payload });
  } catch (error) {
    console.error("❌ Error parsing form data:", error);
    return new Response("Failed to process form data", { status: 500 });
  }
}
