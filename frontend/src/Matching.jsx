import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Matching = () => {
    const { getIdTokenClaims } = useAuth0();
    const [idToken, setIdToken] = useState('');
    const [user, setUser] = useState('');

    useEffect(() => {
        const fetchIdToken = async () => {
            try {
                const idTokenClaims = await getIdTokenClaims();
                setIdToken(idTokenClaims.__raw);
            } catch (error) {
                console.error('Error getting ID token', error);
            }
        };

        fetchIdToken();
    }, [getIdTokenClaims]);

    useEffect(() => {
        fetch(`https://backend.unimatch.lissan.dev/give-me-email?jwt=${idToken}`)
            .then(res => res.json())
            .then(res => setUser(res.email))
    }, [idToken])

    const [data, setData] = useState({})
    const [trigger, setTrigger] = useState(false)

    useEffect(() => {
        if (user == '') return;
        fetch(`https://backend.unimatch.lissan.dev/recommendations?email=${user}`)
            .then(res => res.json())
            .then(data => setData(data))
    }, [trigger, user])

    const handleLike = () => {
        setTrigger(prevTrigger => !prevTrigger)
        fetch(`https://backend.unimatch.lissan.dev/i-like?email=${user}&liked=${data.email}`)
    }

    const handleDislike = () => {
        setTrigger(prevTrigger => !prevTrigger)
        fetch(`https://backend.unimatch.lissan.dev/disliked?email=${user}&disliked=${data.email}`)
    }

    return (
        <div className="flex justify-center items-center" style={{ height: `calc(100vh - 4rem)` }}>
            {!data.name ? <p>Loading...</p> :
            <div className=" rounded-lg relative px-20">
                <div className="relative py-0">
                    {/* Image added to the centered box */}
                    <img
                        className="h-auto rounded-md w-80"
                        src={`https://backend.unimatch.lissan.dev/media/${data.pfp}`}// Replace with the actual URL of your image
                        alt="Centered Image"
                    /> 
                    <div className='absolute bottom-0 w-full h-1/4 bg-white bg-opacity-90 py-1 px-5'>
                        <div>
                            <div className='flex justify-between'>
                                <p className='text-3xl'>{data.name}</p>
                                <div className=''>
                                    <p className='meow'> {data.course} </p>
                                    <p className='text-right'>Year: {data.year}</p>
                                </div>      
                            </div>
                            <div className='text-left'>
                                <p>{data.bio}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className='flex justify-between py-2'>
                    <button className="bg-gray-200 bg-opacity-90 px-4 py-1 rounded-md -bottom-13" onClick={handleDislike}>
                        <img src="./red.png" alt="red" className='h-10 mx-10 object-contain' />
                    </button>

                    <button className="bg-gray-200 bg-opacity-90 px-4 py-1 rounded-md bottom-13" onClick={handleLike}>
                        <img src="./green.png" alt="green" className='h-10 mx-10 object-contain' />
                    </button>
                </div>
            </div>
            }


        </div>
    );
};

export default Matching;