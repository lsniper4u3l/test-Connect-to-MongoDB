// components/CharacterDisplay.js

export default function CharacterDisplay({ equipment }) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-700 text-center mb-4">
          🛡️ อุปกรณ์ที่สวมใส่
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {equipment &&
            Object.keys(equipment).map((slot) => (
              <div
                key={slot}
                className="text-center border p-4 rounded-lg shadow bg-gray-100"
              >
                <h3 className="text-md font-semibold capitalize mb-2">
                  {slot}
                </h3>
                {equipment[slot] ? (
                  <img
                    src={equipment[slot].image}
                    alt={equipment[slot].name}
                    className="w-16 h-16 mx-auto mb-2"
                  />
                ) : (
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded"></div>
                )}
                <p className="text-sm text-gray-500">
                  {equipment[slot] ? equipment[slot].name : 'ไม่มี'}
                </p>
              </div>
            ))}
        </div>
      </div>
    );
  }
  