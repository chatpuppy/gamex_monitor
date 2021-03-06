const date = require('date-and-time');
const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
});

/**
 * While marketplace list order done
 * @param {*} sellData 
 * @returns 
 */
const addDB = async (sellData) => {
	try {
		// Check if duplicated transaction hash
		const sql1 = `select * from orders where transactionHash = '${sellData.transactionHash}'`;
		return connection.query(sql1, async function(error, result, fields) {
			if(result.length > 0) {
				return false;
			} else {
				const sql = `INSERT into orders(contractAddress, sellerAddress, auctionId, nftAddress, blockNumber, transactionHash, tokenId, count, paymentToken, amount, startingPrice, startDate, endDate, nftType, action, createdAt) values ('` + sellData.contractAddress + `','` + sellData.senderAddress + `', '` + sellData.auctionId + `', '` + sellData.nftAddress + `', ` + sellData.blockNumber + `, '` + sellData.transactionHash + `', '` + sellData.tokenId + `', ` + sellData.count + `, '` + sellData.paymentToken + `', ` + sellData.amount + `, '` + sellData.amount + `', ` + sellData.dateTime + `, 3000000000, '` + sellData.nftType + `', '` + sellData.action + `', unix_timestamp())`;
				const promise = new Promise((resolve, reject) => {
					connection.query(
						sql,
						function (error, data, fields) {
							if(error) return reject(error);
							else {
								const dt = date.format(new Date(sellData.dateTime * 1000), 'YYYY-MM-DD HH:mm:ss');
								console.log(`=> ${dt} Sell ${sellData.nftType} #${sellData.tokenId} @${sellData.amount} hash ${sellData.transactionHash}`);
								return resolve(data);
							}
						}
					)
				})
				return promise;	
			}
		})
	} catch (error) {
		console.error(error);
	}
}

/**
 * While mint a new NFT token
 * @param {*} mintNftData 
 * @returns 
 */
const addNFTDB = async (mintNftData) => {
	try {
		// Check if duplicated transaction hash
		// console.log('addNFTDB', mintNftData.tokenId)
		const sql1 = `select * from nfts where nftAddress = '${mintNftData.contractAddress}' and tokenId = ${mintNftData.tokenId}`;
		return connection.query(sql1, async function(error, result, fields) {
			if(result.length > 0) {
				return false;
			} else {
				const sql = `INSERT into nfts(nftAddress, tokenId, owner) values ('${mintNftData.contractAddress}', '${mintNftData.tokenId}', '${mintNftData.transferTo}')`;
				const promise = new Promise((resolve, reject) => {
					connection.query(
						sql,
						function (error, data, fields) {
							if(error) return reject(error);
							else {
								console.log(`=> ${mintNftData.blockNumber} Mint tokenId #${mintNftData.tokenId} hash ${mintNftData.transactionHash}`);
								return resolve(data);
							}
						}
					)
				})
				return promise;	
			}
		})
	} catch (error) {
		console.error(error);
	}
}

/**
 * While transfer NFT token
 * @param {*} buyData 
 * @returns 
 */
const updateOwnerNFTDB = async (mintNftData) => {
	// console.log('updateOwnerNFTDB', mintNftData.tokenId);
	try {
		const sql = `select * from nfts where nftAddress = '${mintNftData.contractAddress}' and tokenId = ${mintNftData.tokenId}`;
		return connection.query(sql, async function(error, data1, fields) {
			if(data1.length === 0) return false;
			else {
				const sql = `update nfts set owner = '${mintNftData.transferTo}' where nftAddress = '${mintNftData.contractAddress}' and tokenId = ${mintNftData.tokenId}`;
				const promise = new Promise((resolve, reject) => {
					connection.query(
						sql,
						function (error, data2, fields) {
							if(error) return reject(error);
							else {
								// const dt = date.format(new Date(mintNftData.dateTime * 1000), 'YYYY-MM-DD HH:mm:ss');
								console.log(`=> ${mintNftData.blockNumber} Transfer #${mintNftData.tokenId} to ${mintNftData.transferTo} hash ${mintNftData.transactionHash}`);
								return resolve(data2);
							}
						}
					)
				})
				return promise;
			}
		})
	} catch (error) {
		console.error(error);
	}
}

/**
 * While update NFT tokenURI
 * @param {*} buyData 
 * @returns 
 */
const updateTokenURINFTDB = async(data) => {
	try {
		const sql = `select * from nfts where nftAddress = '${data.contractAddress}' and tokenId = ${data.tokenId}`;
		return connection.query(sql, async function(error, data1, fields) {
			if(data1.length === 0) return false;
			else {
				const sql = `update nfts set tokenURI = '${data.tokenURI}' where nftAddress = '${data.contractAddress}' and tokenId = ${data.tokenId}`;
				const promise = new Promise((resolve, reject) => {
					connection.query(
						sql,
						function (error, data2, fields) {
							if(error) return reject(error);
							else {
								// const dt = date.format(new Date(mintNftData.dateTime * 1000), 'YYYY-MM-DD HH:mm:ss');
								console.log(`=> ${data.blockNumber} UpdateTokenUri #${data.tokenId} tokenURI ${data.tokenURI} hash ${data.transactionHash}`);
								return resolve(data2);
							}
						}
					)
				})
				return promise;
			}
		})
	} catch (error) {
		console.error(error);
	}
}

/**
 * while update NFT metadata
 * @param {*} buyData 
 * @returns 
 */
const updateMetadataNFTDB = async (data) => {
	try {
		const sql = `select * from nfts where nftAddress = '${data.contractAddress}' and tokenId = ${data.tokenId}`;
		return connection.query(sql, async function(error, data1, fields) {
			if(data1.length == 0) return false;
			else {
				const sql = `update nfts set dna = '${data.dna}', artifacts = '${data.artifacts}' where nftAddress = '${data.contractAddress}' and tokenId = ${data.tokenId}`;
				const promise = new Promise((resolve, reject) => {
					connection.query(
						sql,
						function (error, data2, fields) {
							if(error) return reject(error);
							else {
								// const dt = date.format(new Date(mintNftData.dateTime * 1000), 'YYYY-MM-DD HH:mm:ss');
								console.log(`=> ${data.blockNumber} UpdateMetadata #${data.tokenId} artifacts ${data.artifacts} hash ${data.transactionHash}`);
								return resolve(data2);
							}
						}
					)
				})
				return promise;
			}
		})
	} catch (error) {
		console.error(error);
	}
}

/**
 * While marketplace purchase order done
 * @param {*} buyData 
 * @returns 
 */
const updateBuyDB = async (buyData) => {
	try {
		const sql = `select * from orders where nftAddress = '${buyData.nftAddress}' and tokenId = '${buyData.tokenId}' and auctionId = '${buyData.auctionId}'`;
		return connection.query(sql, async function(error, data1, fields) {
			if(data1.length == 0 || data1[0].buyerTimestamp > 0) return false;
			else {
				const sellData = data1[0];
				const sql = `update orders set buyerAmount = ${buyData.amount}, buyerAddress = '${buyData.senderAddress}', buyerTransactionHash = '${buyData.transactionHash}', buyerBlockNumber = ${buyData.blockNumber}, buyerAction= '${buyData.action}', buyerTimestamp = '${buyData.dateTime}' where nftAddress = '${buyData.nftAddress}' and tokenId = '${buyData.tokenId}' and auctionId = '${buyData.auctionId}'`;
				const promise = new Promise((resolve, reject) => {
					connection.query(
						sql,
						function (error, data2, fields) {
							if(error) return reject(error);
							else {
								const dt = date.format(new Date(buyData.dateTime * 1000), 'YYYY-MM-DD HH:mm:ss');
								console.log(`=> ${dt} Buy ${sellData.nftType} #${sellData.tokenId} @${sellData.amount} hash ${buyData.transactionHash}`);
								return resolve(data2);
							}
						}
					)
				})
				return promise;
			}
		})
	} catch (error) {
		console.error(error);
	}
}

/**
 * While marketplace cancel order done
 * @param {*} cancelData 
 * @returns 
 */
const updateCancelSaleDB = async (cancelData) => {
	try {
		const sql1 = `SELECT * from orders where auctionId = '${cancelData.auctionId}'`;
		return connection.query(sql1, async function(error, data1, fields) {
			if(data1.length == 0 || data1[0].cancelSale == 1) return false;
			else {
				const sql = `update orders set cancelSale = 1 where nftAddress = '${cancelData.nftAddress}' and auctionId = '${cancelData.auctionId}'`;
				return new Promise((resolve, reject) => {
					connection.query(
						sql,
						function(error, data, fields) {
							if(error) return reject(error);
							else {
								console.log(`=> Cancel orderId #${cancelData.auctionId}`);
								return resolve(data);
							}
						}
					)
				})						
			}
		})
	} catch(error) {
		console.error(error);
	}
}

/**
 * while marketplace update price done
 * @param {*} updateData 
 * @returns 
 */
const updatePriceSaleDB = async (updateData) => {
	try {
		const sql1 = `SELECT * from orders where auctionId = '${updateData.auctionId}'`;
		return connection.query(sql1, async function(error, data1, fields) {
			if(data1.length == 0) return false;
			else {
				const sql = `update orders set amount = ${updateData.amount}, startingPrice = ${updateData.amount} where nftAddress = '${updateData.nftAddress}' and auctionId = '${updateData.auctionId}'`;
				return new Promise((resolve, reject) => {
					connection.query(
						sql,
						function(error, data, fields) {
							if(error) return reject(error);
							else {
								console.log(`=> UpdatePrice #${updateData.auctionId} to ${updateData.amount}`);
								return resolve(data);
							}
						}
					)
				})						
			}
		})
	} catch(error) {
		console.error(error);
	}
}

/**
 * Cause the database duplicated write, do the following sql and delete the duplicated records
 */
const deleteDuplicateRowsByField = async (field) => {
	try {
		const sql = `delete orders from orders inner join (select max(id) as lastId, ${field} from orders group by ${field} having count(*) > 1) duplic on duplic.${field} = orders.${field} where orders.id < duplic.lastId`;
		return connection.query(sql, function(error, data, fields) {
			console.log(`=> Delete duplicated ${field} rows: ${data.affectedRows}`);
			return data.affectedRows;
		})	
	} catch(error) {
		console.error(error);
	}
}

module.exports = {
	updateCancelSaleDB,
	updateBuyDB,
	addDB,
	deleteDuplicateRowsByField,
	updatePriceSaleDB,
	addNFTDB,
	updateOwnerNFTDB,
	updateMetadataNFTDB,
	updateTokenURINFTDB
}