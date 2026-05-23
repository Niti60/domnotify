import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");

    if (!file) {
      return Response.json(
        {
          success: false,
          message: "No file uploaded",
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    // Convert buffer to base64
    const base64String = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to cloudinary
    const uploadedImage = await cloudinary.uploader.upload(
      base64String,
      {
        folder: "domnotify/profiles",
      }
    );

    return Response.json(
      {
        success: true,
        imageUrl: uploadedImage.secure_url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return Response.json(
      {
        success: false,
        message: "Image upload failed",
      },
      { status: 500 }
    );
  }
}