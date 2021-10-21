#include <stdlib.h>
#include <stdio.h>
#include <string.h>

#include <curl/curl.h>

// https://ws.miamioh.edu/courseSectionV2/202220.json?campusCode=O&courseSubjectCode=CSE&courseNumber=271


int do_request(char* url, char* filename, char* varname)
{
	CURL* curl;
	char errbuf [CURL_ERROR_SIZE];
	CURLcode res;

	curl = curl_easy_init();
	if (!curl)
	{
		printf(":(");
		return 1;
	}
	
	FILE* fp = fopen( filename, "w" );

	// curl uses fwrite by default
	curl_easy_setopt( curl, CURLOPT_URL, url );
	curl_easy_setopt( curl, CURLOPT_WRITEDATA, fp );
	curl_easy_setopt( curl, CURLOPT_ERRORBUFFER, errbuf );

	fprintf( fp, "const %s = ", varname );
	res = curl_easy_perform( curl );
	fprintf( fp, ";\n" );
	fclose( fp );
	if (res != CURLE_OK) printf("error %d\n%s\n", res, errbuf);

	curl_easy_cleanup( curl );
	return 0;
}

#define SUBJECT_FORMAT_PARAMS "https://ws.miamioh.edu/courseSectionV2/202220.json?campusCode=O&courseSubjectCode=%s", subject

int download_file_from_subject( char* subject )
{
	char* url = NULL;
	int len = snprintf( url, 0, SUBJECT_FORMAT_PARAMS );
	url = malloc(len + 1);
	url[len] = 0;
	sprintf( url, SUBJECT_FORMAT_PARAMS );

	len = strlen(subject) + 3;
	char* filename = malloc(len + 1);
	sprintf( filename, "%s.js", subject );

	do_request( url, filename, subject );
	free(url);
	free(filename);
	return 0;
}

int download_all_subjects()
{
	char subject [4];
	unsigned char subi = 0;
	FILE* fp = fopen( "subject-list.txt", "r" );
	FILE* begin = fp;
	FILE* end = fp;
	int n_subject = 0;
	while (1)
	{
		// read subject into str
		char foundEnd = 0;
		subi = 0;
		while (1)
		{
			int c = fgetc(end);
			switch (c)
			{
			case EOF:
			case '\n':
				foundEnd = 1;
			case ' ':
				subject[subi] = 0;
				goto found_subject;
			default:
				subject[subi] = (char) c;
				++subi;
			}
		}
	found_subject:
		++n_subject;
		printf( "Downloading file for %3s (%d/126) \n", subject, n_subject );
		download_file_from_subject( subject );
		if (foundEnd)
			break;
	}
	return 0;
}

int main(int argc, char** argv)
{
	//do_request( "https://ws.miamioh.edu/courseSectionV2/202220.json?campusCode=O&courseSubjectCode=CSE&courseNumber=271", "h.js", "h" );
	if (argc == 1)
	{
		printf( "need a subject\n" );
		return 1;
	}
	if (strcmp( argv[1], "all" ) == 0)
		download_all_subjects();
	else
		download_file_from_subject( argv[1] );
	return 0;
}

// ./a.out CSE
