import Navigation from '~/components/layouts/Navigation'
import { useAuth } from '~/hooks/auth'

const AppLayout = ({ children }) => {
    const { user } = useAuth({middleware: 'auth'})

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation user={user} />

            {/* Page Content */}
            <main>{children}</main>
        </div>
    )
}

export default AppLayout
