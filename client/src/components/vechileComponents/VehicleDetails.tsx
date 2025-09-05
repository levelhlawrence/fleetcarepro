import { useLocation } from "react-router";

export default function VehicleDetails() {
  const location = useLocation();
  const veh = location.state.bus;
  console.log(veh);

  if (!veh) {
    return "loading...";
  }

  return (
    <section className="px-4 min-h-screen">
      {veh && (
        <div>
          <h1 className="text-2xl font-semibold mt-8 ">
            Vehicle: {veh.bus_no}
          </h1>
          <p className="text-gray-500 text-sm">Type: {veh.vehicle_class}</p>
          <form>
            <div className="grid grid-cols-2 gap-2 mt-8">
              <div>
                <label htmlFor="make">Make: </label>
                <input
                  id="make"
                  name="make"
                  type="text"
                  placeholder={veh.veh_make || "NULL"}
                />
              </div>
              <div>
                <label htmlFor="model">Model: </label>
                <input
                  id="model"
                  name="model"
                  type="text"
                  placeholder={veh.veh_model || "NULL"}
                />
              </div>
              <div>
                <label htmlFor="year">Year: </label>
                <input
                  id="year"
                  name="year"
                  type="text"
                  placeholder={veh.body_year || "NULL"}
                />
              </div>
              <div>
                <label htmlFor="capacity">capacity: </label>
                <input
                  id="capacity"
                  name="capacity"
                  type="text"
                  placeholder={veh.cap || "NULL"}
                />
              </div>
              <div>
                <label htmlFor="mileage">Mileage: </label>
                <input
                  id="mileage"
                  name="mileage"
                  type="text"
                  placeholder={veh.current_mileage || "NULL"}
                />
              </div>
              <div>
                <label htmlFor="engine">Engine: </label>
                <input
                  id="engine"
                  name="engine"
                  type="text"
                  placeholder={veh.eng_manuf || "NULL"}
                />
              </div>
              <div>
                <label htmlFor="eng-model">Engine Model: </label>
                <input
                  id="eng-model"
                  name="eng-model"
                  type="text"
                  placeholder={veh.eng_model || "NULL"}
                />
              </div>
              <div>
                <label htmlFor="fuel-type">Fuel Type: </label>
                <input
                  id="fuel-type"
                  name="fuel-type"
                  type="text"
                  placeholder={veh.fuel_type || "NULL"}
                />
              </div>
              <div>
                <label htmlFor="make">Gross Weight: </label>
                <input
                  id="make"
                  name="make"
                  type="text"
                  placeholder={`${veh.gross_weight || "NULL"}lbs`}
                />
              </div>
              <div>
                <label htmlFor="status">Status: </label>
                <input
                  id="status"
                  name="status"
                  type="text"
                  placeholder={veh.status || "NULL"}
                />
              </div>
              <div>
                <label htmlFor="vin">Vin: </label>
                <input
                  id="vin"
                  name="vin"
                  type="text"
                  placeholder={veh.vin_number || "NULL"}
                />
              </div>
              <div>
                <label htmlFor="tag">Tag: </label>
                <input
                  id="tag"
                  name="tag"
                  type="text"
                  placeholder={veh.tag_no}
                />
              </div>
              <div>
                <label htmlFor="tag">Wheelchair: </label>
                <input
                  id="tag"
                  name="tag"
                  type="text"
                  placeholder={veh.wheel_chair || "NO"}
                />
              </div>
              <div>
                <label htmlFor="tag">Body No: </label>
                <input
                  id="body_no"
                  name="body_no"
                  type="text"
                  placeholder={veh.body_no || "NULL"}
                />
              </div>
            </div>
            <input
              className="bg-blue-400 w-1/4 mt-4 py-2 rounded hover:cursor-pointer hover:bg-blue-500 text-white transition"
              type="submit"
              value="Update"
            />
          </form>
        </div>
      )}
    </section>
  );
}
