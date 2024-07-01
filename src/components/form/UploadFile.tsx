import Icon from '../icon/Icon'
import Input from './Input'

interface IUploadFileInput {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  multiple?: boolean;
  value: string | string[];
  handleRemoveFile: (index?: number | null) => void;
}

const UploadFile = (props: IUploadFileInput) => {
  const {
    handleFileChange,
    multiple = false,
    value,
    handleRemoveFile
  } = props
  return (
    <div className={`border-1 p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 relative min-h-[42px]`}>
      <Input
        name='file'
        type='file'
        multiple={multiple}
        accept='.pdf,.jpeg,.png,.doc,.docx,.pages'
        onChange={handleFileChange}
        className='absolute top-0 left-0 bottom-0 right-0 z-10 opacity-0 cursor-pointer'
        id='file-upload'
      />
      {Array.isArray(value) && value.length > 0 ? (
        <div className='flex  gap-2 flex-wrap  '>
          {value?.map((item: string, index) => (
            <div key={item} className='w-fit p-1.5 relative rounded-lg bg-zinc-200 dark:bg-zinc-600 pr-9'>
              {item}
              <Icon
                className='mx-2 cursor-pointer w-6 h-6 absolute right-0 z-40 top-[6px]'
                icon={'CrossIcon'}
                onClick={() => handleRemoveFile(index)}
              />
            </div>
          ))}
        </div>
      ) : typeof value === 'string' && value ?
        <div className='w-fit p-1.5 relative rounded-lg bg-zinc-200 dark:bg-zinc-600 pr-9'>
          {value}
          
          <Icon
            className='mx-2 cursor-pointer w-6 h-6 absolute right-0 z-40 top-[6px]'
            icon={'CrossIcon'}
            onClick={() => handleRemoveFile()}
          />
        </div>
        :
        <div className='flex gap-1 items-center'>
          <Icon
            className='mx-2 cursor-pointer w-8 h-8'
            icon={'DuoCloudUpload'}
          />
          Upload Document
        </div>
      }
    </div>
  )
}

export default UploadFile;
