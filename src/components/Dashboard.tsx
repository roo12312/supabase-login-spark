
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { LogOut, Database, RefreshCw } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface DemoData {
  id: number
  data: string
}

interface DashboardProps {
  user: User
}

export const Dashboard = ({ user }: DashboardProps) => {
  const [demoData, setDemoData] = useState<DemoData[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  const fetchDemoData = async () => {
    try {
      const { data, error } = await supabase
        .from('demo_data')
        .select('*')
        .order('id', { ascending: false })

      if (error) {
        console.error('Error fetching demo data:', error)
        toast({
          title: "Error",
          description: "Failed to fetch data",
          variant: "destructive",
        })
        setDemoData([])
      } else {
        setDemoData(data || [])
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      setDemoData([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDemoData()
  }, [])

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Logged out successfully!",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchDemoData()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user.email}
            </p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Demo Data Table */}
        <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-0">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Demo Data Table
                </CardTitle>
                <CardDescription>
                  Data from the demo_data table in your Supabase database
                </CardDescription>
              </div>
              <Button 
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={refreshing}
                className="transition-all duration-200"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : demoData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No data found in the demo_data table</p>
                <p className="text-sm mt-2">Add some data to see it here!</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">ID</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoData.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono text-sm">{item.id}</TableCell>
                        <TableCell>{item.data || <span className="text-muted-foreground italic">No data</span>}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
