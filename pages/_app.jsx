import { Fragment } from 'react'
import { ChakraProvider } from "@chakra-ui/react"
import '~/styles/globals.css'

function App({ Component, pageProps }) {
    const Layout = Component.Layout ?? Fragment

    return (
        <ChakraProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </ChakraProvider>
    )
}

export default App
