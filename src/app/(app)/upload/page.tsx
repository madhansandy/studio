import UploadForm from "./components/upload-form";

export default function UploadPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Upload Prescription</h1>
                <p className="text-muted-foreground">Verify your prescription for safety and potential issues using our AI.</p>
            </div>
            
            <UploadForm />
        </div>
    );
}
