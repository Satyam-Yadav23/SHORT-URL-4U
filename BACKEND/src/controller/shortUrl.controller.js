import { createShortUrlWithoutUser, createShortUrlWithUser } from '../services/shortUrl.service.js';
import { getShortUrl } from '../dao/shortUrl.js';
import wrapAsync from '../utils/tryCatchWrapper.js';
import { NotFoundError, BadRequestError } from '../utils/errorHandler.js';

const getShortUrlBase = () =>
  (process.env.APP_URL || 'http://localhost:3000').replace(/\/+$/, '');


export const createShortUrl = wrapAsync(async (req, res) => {
  const data = req.body;
  const { url } = data;
  
  // Validate URL is provided
  if (!url) {
    throw new BadRequestError('URL is required. Make sure to send {"url": "https://example.com"}');
  }
  
  // Validate URL format
  try {
    new URL(url);
  } catch (err) {
    throw new BadRequestError('Invalid URL format');
  }
  
  let shortUrl;
  if(req.user) {
    shortUrl = await createShortUrlWithUser(data.url, req.user._id, data.customUrl);
  } else {
    shortUrl = await createShortUrlWithoutUser(data.url);
  }
  res.status(200).json({ shortUrl: `${getShortUrlBase()}/${shortUrl}` });
});

export const redirectFromShortUrl = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const url = await getShortUrl(id);
  if(!url) {
    throw new Error("Short URL not found");
  }
  res.redirect(url.full_url);
});

export const createCustomShortUrl = wrapAsync(async (req, res) => {
  const data = req.body;
  let shortUrl;
  if(req.user){
    shortUrl= await createShortUrlWithUser(data.url, req.user._id, data.customUrl)
  }else{
    shortUrl = await createShortUrlWithoutUser(data.url);
  }
  res.status(200).json({ shortUrl: `${getShortUrlBase()}/${shortUrl}` });
});