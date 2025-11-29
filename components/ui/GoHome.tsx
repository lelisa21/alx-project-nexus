
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
const GoHome = () => {
 return (<Link
          href="/"
          className="inline-flex items-center text-md hover:text-gray-300 mb-8 group bg-amber-800 text-white px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>)

}

export default GoHome

