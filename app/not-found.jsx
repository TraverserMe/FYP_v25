import React from 'react';
import Link from 'next/link';

export default function NotFound (){

    return(

        <main class="text-center">
            <h2 class="text-3xl">
                There was a problem with your request. 404
            </h2>
            <p>
                We cound not found the page you were looking for...
            </p>
            <p>
                Go back to the <Link href="/">Index</Link>
            </p>

        </main>

    )

}