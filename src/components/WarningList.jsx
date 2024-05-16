export default function WarningList({name, prefix, items}){
  return (
    <>
    {items?.length > 0 && 
      <>
        <h4 className="text-xl">{name}: {items.filter(item => item.startsWith(prefix)).map(item => item.split(prefix)[1]).join(', ')}</h4>
      </>
    }
    </>
  )
}