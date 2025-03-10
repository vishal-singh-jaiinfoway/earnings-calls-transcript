"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Transcript() {

    const [isTranscriptLoading, setIsTranscriptLoading] = useState(false);
    const [transcript, setTranscript] = useState<any>([]);

    const selectedCompany = useSelector((state: any) => state.sidebar.selectedCompany);
    const selectedYear = useSelector((state: any) => state.sidebar.selectedYear);
    const selectedQuarter = useSelector((state: any) => state.sidebar.selectedQuarter);


    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/transcript`;

    useEffect(() => {
        if (selectedCompany && selectedQuarter && selectedYear) {
            fetchTranscript(selectedCompany, selectedQuarter, selectedYear)
        }
    }, [selectedCompany, selectedQuarter, selectedYear])


    async function fetchTranscript(selectedCompany: any, selectedQuarter: string, selectedYear: number) {
        setIsTranscriptLoading(true);

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ selectedCompany, selectedQuarter, selectedYear }),
        });

        if (!response.ok) {
            console.error("Failed to fetch data");
            setIsTranscriptLoading(false);
            return;
        }

        // Read response fully (without streaming)
        const jsonData = await response.json();
        try {
            if (jsonData.transcript?.length) {
                console.log(jsonData)
                setTranscript(jsonData)
            } else {
                setTranscript([{
                    speaker: "Not found",
                    text: "No transcript available"
                }])
            }
        } catch (error) {
            console.error("Error processing JSON:", error);
            setTranscript([{
                speaker: "Error",
                text: "Error loading transcript."
            }])
        } finally {
            setIsTranscriptLoading(false);
        }
    }



    return (
        <div className="h-screen flex flex-col  px-6 py-0 space-y-6">
            <Card className="bg-gray-200 shadow-lg rounded-xl border">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Transcript</CardTitle>
                </CardHeader>
                <CardContent className="py-4">
                    {isTranscriptLoading ? (
                        <div className="flex justify-center items-center py-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                        </div>
                    ) :
                        <div className="prose ml-6">

                            {/* Company & Event Details */}
                            <h2 className="text-2xl font-bold text-blue-600">{transcript?.company_name}</h2>
                            <p className="text-lg text-gray-600">{transcript?.event}</p>
                            <hr className="my-4" />
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Participants Section */}
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Participants:</h3>
                                    <ul className="list-disc list-inside text-gray-700">
                                        {transcript?.participants?.map((participant: string, index: number) => (
                                            <li key={index}>{participant}</li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Topics Section */}
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Key Topics:</h3>
                                    <ul className="list-disc list-inside text-gray-700">
                                        {transcript?.topics?.map((topic: string, index: number) => (
                                            <li key={index}>{topic}</li>
                                        ))}
                                    </ul>
                                </div>

                            </div>



                            {/* Transcript Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Transcript:</h3>
                                <div className="space-y-4 mt-2">
                                    {transcript?.transcript?.map((entry: any, index: number) => (
                                        <div key={index} className="p-3 border rounded-lg bg-gray-50">
                                            <p className="font-semibold">{entry.speaker}:</p>
                                            <p className="text-gray-700">{entry.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    }
                </CardContent>
            </Card>
        </div>
    );
}
