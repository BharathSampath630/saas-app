import { cn } from "@/lib/utils" 
import Link from "next/link"
import Image from "next/image";
import { getSubjectColor } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]

export function TableDemo() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

interface CompanionListProps{
    title:string;
    companions?: Companion[];
    classNames?: string;
}

const CompanionsList = ({title,companions,classNames}: CompanionListProps) => {
  return (
    <article className={cn('companion-list', classNames)}>
        <h2 className="font-bold text-3xl">Recent Sessions</h2>

        <Table className="pb-6">
            <TableHeader>
                <TableRow>
                    <TableHead className="text-lg w-2/3">Lessons</TableHead>
                    <TableHead className="text-lg">Subject</TableHead>
                    <TableHead className="text-lg text-right">Duration</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {companions?.map(({id,subject,name,topic,duration})=>(
                    <TableRow key = {id}>
                        <TableCell>
                            <Link href = {`/companions/${id}`}>
                                <div className="flex items-center gap-2">
                                    <div className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden" style = {{backgroundColor:getSubjectColor(subject)}}>
                                        <Image
                                            src = {`/icons/${subject}.svg`} 
                                            alt = {subject} 
                                            width= {35} 
                                            height = {35} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <p className="font-bold text-2xl">
                                            {name}
                                        </p>
                                        <p className="text-lg">
                                            {topic}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </TableCell>
                        <TableCell>
                            <div className="subject-badge w-fit max-md:hidden">
                                {subject}
                            </div>
                            <div className="flex items-center justify-center 
                            rounded-lg w-fit p-2 md:hidden" 
                            style={{backgroundColor:getSubjectColor(subject)}}>
                                <Image src = { `/icons/${subject}.svg`}
                                        alt = {subject}
                                        width={18}
                                        height={18} 
                                />
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2 w-full justify-end">
                                <p className="text-2xl">
                                    {duration}{' '}
                                    <span className="max-md:hidden">mins</span>
                                </p>
                                <Image src = "icons/clock.svg" alt="minutes"
                                width={14} height={14} className="md:hidden"/>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </article>
  )
}

export default CompanionsList