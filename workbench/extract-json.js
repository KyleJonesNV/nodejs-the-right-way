'use strict'

const message = "{\"pallet\":{\"id\":\"uc-2686696961\",\"productType\":\"ev32\",\"quantity\":624,\"line\":\"2\",\"shift\":\"A\",\"stacks\":[{\"trays\":[{\"id\":\"dih-007185077302\",\"productType\":\"ev32\"},{\"id\":\"dih-003806284017\",\"productType\":\"ev32\"},{\"id\":\"dih-003307207323\",\"productType\":\"ev32\"},{\"id\":\"dih-005766685878\",\"productType\":\"ev32\"},{\"id\":\"dih-009825580853\",\"productType\":\"ev32\"},{\"id\":\"dih-000876248282\",\"productType\":\"ev32\"},{\"id\":\"dih-000644479799\",\"productType\":\"ev32\"},{\"id\":\"dih-002215080731\",\"productType\":\"ev32\"},{\"id\":\"dih-005723607411\",\"productType\":\"ev32\"},{\"id\":\"dih-006695137837\",\"productType\":\"ev32\"},{\"id\":\"dih-008565341791\",\"productType\":\"ev32\"},{\"id\":\"dih-002845763239\",\"productType\":\"ev32\"},{\"id\":\"dih-004645702941\",\"productType\":\"ev32\"}]},{\"trays\":[{\"id\":\"dih-001495544302\",\"productType\":\"ev32\"},{\"id\":\"dih-003633831683\",\"productType\":\"ev32\"},{\"id\":\"dih-008734106475\",\"productType\":\"ev32\"},{\"id\":\"dih-008684199109\",\"productType\":\"ev32\"},{\"id\":\"dih-004536118984\",\"productType\":\"ev32\"},{\"id\":\"dih-006958638340\",\"productType\":\"ev32\"},{\"id\":\"dih-009274416766\",\"productType\":\"ev32\"},{\"id\":\"dih-008762516270\",\"productType\":\"ev32\"},{\"id\":\"dih-003442756123\",\"productType\":\"ev32\"},{\"id\":\"dih-007899666788\",\"productType\":\"ev32\"},{\"id\":\"dih-006647621798\",\"productType\":\"ev32\"},{\"id\":\"dih-009782659111\",\"productType\":\"ev32\"},{\"id\":\"dih-008566212177\",\"productType\":\"ev32\"}]}]},\"batchDate\":\"2023-06-19\"}"
const messgae2 = "{\"pallet\":{\"id\":\"uc-005406122209\",\"productType\":\"ev32\",\"quantity\":624,\"line\":\"2\",\"shift\":\"A\",\"stacks\":[{\"trays\":[{\"id\":\"dih-005496248813\",\"productType\":\"ev32\"},{\"id\":\"dih-008566212177\",\"productType\":\"ev32\"},{\"id\":\"dih-002693978770\",\"productType\":\"ev32\"},{\"id\":\"dih-003632932343\",\"productType\":\"ev32\"},{\"id\":\"dih-003401585635\",\"productType\":\"ev32\"},{\"id\":\"dih-004800128997\",\"productType\":\"ev32\"},{\"id\":\"dih-008764810645\",\"productType\":\"ev32\"},{\"id\":\"dih-000936336020\",\"productType\":\"ev32\"},{\"id\":\"dih-002239701531\",\"productType\":\"ev32\"},{\"id\":\"dih-006174807177\",\"productType\":\"ev32\"},{\"id\":\"dih-000500608598\",\"productType\":\"ev32\"},{\"id\":\"dih-009584070200\",\"productType\":\"ev32\"},{\"id\":\"dih-005951180979\",\"productType\":\"ev32\"}]},{\"trays\":[{\"id\":\"dih-000896665726\",\"productType\":\"ev32\"},{\"id\":\"dih-007893872018\",\"productType\":\"ev32\"},{\"id\":\"dih-006477394417\",\"productType\":\"ev32\"},{\"id\":\"dih-006429926870\",\"productType\":\"ev32\"},{\"id\":\"dih-004040852664\",\"productType\":\"ev32\"},{\"id\":\"dih-006705598823\",\"productType\":\"ev32\"},{\"id\":\"dih-009246025089\",\"productType\":\"ev32\"},{\"id\":\"dih-006505878364\",\"productType\":\"ev32\"},{\"id\":\"dih-001625492707\",\"productType\":\"ev32\"},{\"id\":\"dih-001223484468\",\"productType\":\"ev32\"},{\"id\":\"dih-006197378347\",\"productType\":\"ev32\"},{\"id\":\"dih-007588707669\",\"productType\":\"ev32\"},{\"id\":\"dih-002044421172\",\"productType\":\"ev32\"}]}]},\"batchDate\":\"2023-06-19\"}"
const jsonMessage = JSON.parse(message)
const jsonMessage2 = JSON.parse(messgae2)

console.log(jsonMessage)
console.log(jsonMessage.pallet.stacks[0].trays)
console.log(jsonMessage.pallet.stacks[1].trays)
console.log(jsonMessage2)
console.log(jsonMessage2.pallet.stacks[0].trays)
console.log(jsonMessage2.pallet.stacks[1].trays)