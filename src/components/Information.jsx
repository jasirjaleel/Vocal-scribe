import React, { useEffect, useRef, useState } from 'react'
import Transcription from './Transcription'
import Translation from './Translation'

export default function Information(props) {
    const { output, finished } = props;
    const [tab,setTab] = useState('transcription')
    const [translation, setTranslation] = useState(null)
    const [translating, setTranslating] = useState(null)
    const [toLanguage, setToLanguage] = useState('Select language')
    
    const worker = useRef()

    useEffect(() => {
        if (!worker.current) {
            worker.current = new Worker(new URL('../utils/translate.worker.js', import.meta.url), {
                type: 'module'
            })
        }

        const onMessageReceived = async (e) => {
            switch (e.data.status) {
                case 'initiate':
                    console.log('DOWNLOADING')
                    break;
                case 'progress':
                    console.log('LOADING')
                    break;
                case 'update':
                    setTranslation(e.data.output)
                    console.log(e.data.output)
                    break;
                case 'complete':
                    setTranslating(false)
                    console.log("DONE")
                    break;
            }
        }

        worker.current.addEventListener('message', onMessageReceived)

        return () => worker.current.removeEventListener('message', onMessageReceived)
    })
    
    const textElement = tab === 'transcription' ? output.map(val => val.text) : translation || 'No translation';

    function handleCopy() {
        navigator.clipboard.writeText(textElement)
    }

    function handleDownload() {
        const element = document.createElement('a')
        const file = new Blob([textElement], {type:'type/plain'})
        element.href = URL.createObjectURL(file)
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        const formattedTime = `${hours}-${minutes}-${seconds}`;

        const fileName = `Voicescribe_${formattedDate}_${formattedTime}.txt`;

        element.download = fileName;
        document.body.appendChild(element)
        element.click()
    }

    function generateTranslation(){
        if (translating || toLanguage === 'Select language'){
            return 
        }
        setTranslating(true)
        worker.current.postMessage({
            text: output.map(val => val.text),
            src_lang: ' eng_Latn',
            tgt_lang:toLanguage
        })
    }


  return (
    <main className='flex-1 p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center pb-20 max-w-prose w-full mx-auto'>
        <h1 className='font-semibold text-4xl sm:text-5xl md:text-6xl whitespace-nowrap'>Your <span className='text-blue-400 bold'>Transcription</span></h1>
        <div className="grid grid-cols-2 mx-auto bg-white shadow rounded-full overflow-hidden items-center">
            <button onClick={()=>setTab('transcription')} className={'px-4 duration-200 py-1  ' + (tab === 'transcription' ? ' bg-blue-300 text-white' : ' text-blue-400 hover:text-blue-600')}>Transcription</button>
            <button onClick={()=>setTab('translation')} className={'px-4 duration-200 py-1  ' + (tab === 'translation' ? ' bg-blue-300 text-white' : ' text-blue-400 hover:text-blue-600')}>Translation</button>
        </div>
        <div className="my-8 flex  flex-col-reverse max-w-prose w-full mx-auto gap-4">
        {tab === 'transcription' ? (
            <Transcription {...props} textElement={textElement} />
        ) : (
            <Translation {...props} toLanguage={toLanguage} translating={translating} textElement={textElement} setTranslating={setTranslating} setTranslation={setTranslation} setToLanguage={setToLanguage} generateTranslation={generateTranslation} />
        )}
        </div>
        <div className="flex items-center gap-4 mx-auto">
            <button onClick={handleCopy} title='Copy' className='bg-white  hover:text-blue-500 duration-200 text-blue-300 px-2 rounded aspect-square grid place-items-center'>
                <i className="fa-light fa-copy"></i>
            </button>
            <button onClick={handleDownload} title='Download' className='bg-white hover:text-blue-500 duration-200 text-blue-300 px-2 rounded aspect-square grid place-items-center'>
                <i className="fa-light fa-download"></i>
            </button>
        </div>
    </main>
  )
}
