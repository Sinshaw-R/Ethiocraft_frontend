'use client'

import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle2, Clock, Truck, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function AgentDashboard() {
  const taskStats = [
    {
      title: 'Total Verifications',
      value: '156',
      icon: CheckCircle2,
    },
    {
      title: 'Pending Tasks',
      value: '12',
      icon: Clock,
    },
    {
      title: 'Active Shipments',
      value: '34',
      icon: Truck,
    },
    {
      title: 'Issues Flagged',
      value: '3',
      icon: AlertCircle,
    },
  ]

  const verificationTasks = [
    {
      id: 1,
      type: 'Artisan Verification',
      name: 'Bekele Wolde',
      date: 'Dec 16, 2024',
      status: 'Pending',
    },
    {
      id: 2,
      type: 'Product Authenticity Check',
      name: 'Traditional Habesha Dress',
      date: 'Dec 15, 2024',
      status: 'Pending',
    },
    {
      id: 3,
      type: 'Artisan Documents',
      name: 'Selam Adeyemi',
      date: 'Dec 14, 2024',
      status: 'Completed',
    },
  ]

  const shipments = [
    {
      id: 'SHP-001',
      order: 'ORD-001',
      customer: 'Ahmed Hassan',
      status: 'In Transit',
      destination: 'Addis Ababa',
      date: 'Dec 15, 2024',
    },
    {
      id: 'SHP-002',
      order: 'ORD-002',
      customer: 'Fatima Ali',
      status: 'Pending Pickup',
      destination: 'Dire Dawa',
      date: 'Dec 14, 2024',
    },
    {
      id: 'SHP-003',
      order: 'ORD-003',
      customer: 'Mohammed Taye',
      status: 'Delivered',
      destination: 'Mekelle',
      date: 'Dec 12, 2024',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-primary text-primary-foreground'
      case 'In Transit':
        return 'bg-secondary text-secondary-foreground'
      case 'Pending Pickup':
        return 'bg-muted text-muted-foreground'
      case 'Delivered':
        return 'bg-primary text-primary-foreground'
      case 'Pending':
        return 'bg-accent/20 text-accent'
      default:
        return 'bg-border text-foreground'
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-inter">
      <Header />

      <main className="flex-1 pt-24 md:pt-28">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="font-druk-medium text-3xl md:text-4xl uppercase tracking-[0.04em] mb-2">Agent Dashboard</h1>
            <p className="font-inter text-muted-foreground">Manage verification tasks and shipment logistics</p>
          </div>

          {/* Task Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {taskStats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <Card key={i} className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-aeonik text-xs uppercase tracking-[0.14em] text-muted-foreground mb-1">{stat.title}</p>
                      <p className="font-druk-medium text-2xl">{stat.value}</p>
                    </div>
                    <Icon className="w-8 h-8 text-secondary opacity-20" />
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="verification" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="verification" className="font-aeonik text-xs uppercase tracking-[0.12em]">Verification Tasks</TabsTrigger>
              <TabsTrigger value="shipments" className="font-aeonik text-xs uppercase tracking-[0.12em]">Shipments</TabsTrigger>
              <TabsTrigger value="reports" className="font-aeonik text-xs uppercase tracking-[0.12em]">My Reports</TabsTrigger>
            </TabsList>

            {/* Verification Tasks Tab */}
            <TabsContent value="verification" className="space-y-4">
              <h2 className="font-aeonik text-lg uppercase tracking-[0.12em] font-bold mb-4">Verification Tasks</h2>

              <div className="space-y-3">
                {verificationTasks.map((task) => (
                  <Card key={task.id} className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <Badge className="font-aeonik mb-2 bg-primary/20 text-primary">{task.type}</Badge>
                        <p className="font-inter font-semibold">{task.name}</p>
                        <p className="font-inter text-sm text-muted-foreground">{task.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                        {task.status === 'Pending' && (
                          <Link href={`/agent/verification/${task.id}`}>
                            <Button className="bg-primary">Review</Button>
                          </Link>
                        )}
                        {task.status === 'Completed' && (
                          <Link href={`/agent/verification/${task.id}`}>
                            <Button variant="outline">View</Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Shipments Tab */}
            <TabsContent value="shipments" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-aeonik text-lg uppercase tracking-[0.12em] font-bold">Shipment Tracking</h2>
                <Link href="/agent/shipments">
                  <Button variant="outline">View All</Button>
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="font-aeonik text-left text-xs uppercase tracking-[0.12em] py-3 px-4">Shipment ID</th>
                      <th className="font-aeonik text-left text-xs uppercase tracking-[0.12em] py-3 px-4">Order</th>
                      <th className="font-aeonik text-left text-xs uppercase tracking-[0.12em] py-3 px-4">Customer</th>
                      <th className="font-aeonik text-left text-xs uppercase tracking-[0.12em] py-3 px-4">Destination</th>
                      <th className="font-aeonik text-left text-xs uppercase tracking-[0.12em] py-3 px-4">Status</th>
                      <th className="font-aeonik text-left text-xs uppercase tracking-[0.12em] py-3 px-4">Date</th>
                      <th className="font-aeonik text-left text-xs uppercase tracking-[0.12em] py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.map((shipment) => (
                      <tr key={shipment.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 font-semibold">{shipment.id}</td>
                        <td className="py-3 px-4">{shipment.order}</td>
                        <td className="py-3 px-4">{shipment.customer}</td>
                        <td className="py-3 px-4">{shipment.destination}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(shipment.status)}>{shipment.status}</Badge>
                        </td>
                        <td className="py-3 px-4 text-sm">{shipment.date}</td>
                        <td className="py-3 px-4">
                          <Link href={`/agent/shipments/${shipment.id}`}>
                            <Button variant="outline" size="sm">
                              Track
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-4">
              <h2 className="font-aeonik text-lg uppercase tracking-[0.12em] font-bold mb-4">My Reports</h2>

              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="font-aeonik text-xs uppercase tracking-[0.12em] text-muted-foreground mb-1">This Month Performance</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="font-druk-medium text-xl">45</p>
                        <p className="font-inter text-xs text-muted-foreground">Verifications Done</p>
                      </div>
                      <div>
                        <p className="font-druk-medium text-xl">98%</p>
                        <p className="font-inter text-xs text-muted-foreground">Accuracy Rate</p>
                      </div>
                      <div>
                        <p className="font-druk-medium text-xl">156</p>
                        <p className="font-inter text-xs text-muted-foreground">Shipments Tracked</p>
                      </div>
                      <div>
                        <p className="font-druk-medium text-xl">2.1d</p>
                        <p className="font-inter text-xs text-muted-foreground">Avg Response Time</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h3 className="font-aeonik text-xs uppercase tracking-[0.12em] font-bold mb-3">Recent Actions</h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">• Verified Artisan: Bekele Wolde - Dec 16</p>
                      <p className="text-muted-foreground">• Updated Shipment: SHP-001 - Dec 15</p>
                      <p className="text-muted-foreground">• Checked Product Authenticity: 5 items - Dec 14</p>
                    </div>
                  </div>
                </div>

                <Link href="/agent/reports">
                  <Button className="bg-primary hover:bg-primary/90 mt-4">Generate Full Report</Button>
                </Link>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .font-druk-medium { font-family: var(--font-druk-medium), sans-serif; }
        .font-aeonik      { font-family: var(--font-aeonik), sans-serif; }
        .font-inter       { font-family: var(--font-inter), sans-serif; }
      `}</style>
    </div>
  )
}
