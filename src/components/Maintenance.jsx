const Maintenance = () => {
    return(
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-gray-800 text-center">Under Maintenance</h1>
            <p className="mt-4 text-lg text-gray-600 text-center">We are currently working on something awesome. Stay tuned!</p>
            <div className="mt-8">
                <img src="/assets/maintenance.svg" alt="Maintenance" className="w-1/2 h-auto" />
            </div>
        </div>
    )
}

export default Maintenance;
