"use client";
import { ArrowUpRight } from "lucide-react"
import { useEffect, useState } from "react";
import { companies, quarters, years } from "../../../../public/data";
import { useSelector } from 'react-redux';
import { useRouter } from "next/navigation";

const CustomHeader = () => {
    const router = useRouter()
    const [company, setSelectedCompany] = useState<any>(companies[0]);
    const [year, setSelectedYear] = useState<any>(years[0]);
    const [quarter, setSelectedQuarter] = useState<any>(quarters[0]);



    const selectedTab = useSelector((state: any) => state.sidebar.selectedTab)
    const selectedCompany = useSelector((state: any) => state.sidebar.selectedCompany);
    const selectedYear = useSelector((state: any) => state.sidebar.selectedYear);
    const selectedQuarter = useSelector((state: any) => state.sidebar.selectedQuarter);


    useEffect(() => {
        setSelectedCompany(selectedCompany);
        setSelectedYear(selectedYear);
        setSelectedQuarter(selectedQuarter);
    }, [selectedCompany, selectedQuarter, selectedYear, selectedTab]);

    const handleClick = () => {
        router.push('transcript')
    }
   


    return <div className="flex justify-between items-center bg-white p-5 shadow-md rounded-xl border">
        <span className="flex items-center space-x-2 text-blue-700" onClick={handleClick}>
            <ArrowUpRight size={18} />
            <span className="text-md font-semibold">See Transcript</span>
        </span>
      
        <span className="text-lg font-bold text-gray-900">
            {company?.ticker} {quarter} Quarter, {year} Earnings Call
        </span>
    </div>

}

export default CustomHeader