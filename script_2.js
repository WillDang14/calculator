/* 
	2 - (4 - (4 - (3 + 2) x 2
	==>> bị lỗi không thêm dấu ")"
	==>> nhưng nếu viết ngược lại 
	==>> 2 - (4 - (4 - 2 x (3 + 2) ===>> thì lại thêm được ngoặc đóng ")"


*/


const keys = document.querySelectorAll('.key');

const display_input = document.querySelector('.display .input');

const display_output = document.querySelector('.display .output');

let input = "";


/* ================================================== */
/* ================== My code ======================= */
let operators = ["+", "-", "*", "/"];

let specialKey = ["+", "-", "*", "/", "(", ")", "."];


/* ================================================== */
/* 
	Phần logic cho bracket có vấn đề khi đóng ngoặc ")"
	==>> tức là nguyên mẫu thì ngoặc ")" vẫn đóng được cho dù không có number nào trước đó ==>> (2+ )*3 sẽ gây lỗi
	==>> cần phải kiểm tra trước khi đóng ngoặc có number nào hay không

	Cách tốt nhất là tạo 2 button mở ngoặc và đóng ngoặc riêng biệt

	https://www.w3schools.com/jsref/jsref_indexof.asp

	The indexOf() method returns the position of the first occurrence of a value in a string.

	The indexOf() method returns -1 if the value is not found.
*/

for (let key of keys) {
	
	const value = key.dataset.key;

	key.addEventListener('click', () => {

        if (value == "clear") {
			
            input = "";
			
            display_input.innerHTML = "";

			display_output.innerHTML = "";

		} else if (value == "backspace") {			
            
			// console.log(input);

			// lấy ra string từ element đầu tiên đến trước element cuối
			input = input.slice(0, -1);

			// console.log(input);

			// sau khi lấy ra string bớt element cuối thì hiển thị ra màn hình
			display_input.innerHTML = CleanInput(input);
			// display_input.innerHTML = input;
		
		} else if (value == "=") {
			
            // let result = eval(PerpareInput(input));
            let result = eval(PerpareInput(input)).toFixed(3);

			display_output.innerHTML = CleanOutput(result);

		} else if (value == "brackets") {

            input += bracketsCheck(input);
			// console.log(input);

			display_input.innerHTML = CleanInput(input);

		} else {
			
            if ( ValidateInput(value) ) {

				input += value;
				
                display_input.innerHTML = CleanInput(input);

			};

		};

    });

};


/* ================================================== */
/* 
	Description
	The split() method splits a string into an array of substrings.

	The split() method returns the new array.

	The split() method does not change the original string.

	If (" ") is used as separator, the string is split between words.
	==>> chú ý có khoảng trắng giữa 2 dấu nháy nghĩa là tách string thành những word riêng lẻ
	==>> nếu không có khoảng trắng giữa 2 dấu nháy thì nghĩa là tách string thành những kí tự


*/

function CleanInput(input) {

	let input_array = input.split("");

	// console.log(input_array);
	
    let input_array_length = input_array.length;

	// tìm trong array element nào có những kí tự đặc biệt thì thay thế bằng <span>....<span>
	
	for (let i = 0; i < input_array_length; i++) {

		if (input_array[i] == "*") {
		
			input_array[i] = ` <span class="operator">x</span> `;

		} else if (input_array[i] == "/") {
			
			input_array[i] = ` <span class="operator">÷</span> `;

		} else if (input_array[i] == "+") {
			
			input_array[i] = ` <span class="operator">+</span> `;

		} else if (input_array[i] == "-") {
			
			input_array[i] = ` <span class="operator">-</span> `;

		} else if (input_array[i] == "(") {
			
			input_array[i] = `<span class="brackets">(</span>`;

		} else if (input_array[i] == ")") {
			
			input_array[i] = `<span class="brackets">)</span>`;

		} else if (input_array[i] == "%") {
			
			input_array[i] = `<span class="percent">%</span>`;

		}
	}

	// console.log(input_array);

	// sau đó thì sẽ nối lại thành string mới
	return input_array.join("");
}

/* ================================================== */
function CleanOutput (output) {
	
	let output_string = output.toString();

	// Chia số thập phân làm 2 phần ==>> [0] là phần nguyên, [1] là phần thập phân (sau dấu chấm)
	let decimal = output_string.split(".")[1];
	
	output_string = output_string.split(".")[0];

	let output_array = output_string.split("");
	
	if (output_array.length > 3) {
	
		for (let i = output_array.length - 3; i > 0; i -= 3) {
	
			output_array.splice(i, 0, ",");
	
		}
	
	}

	if (decimal) {
	
		output_array.push(".");
	
		output_array.push(decimal);
	
	}

	return output_array.join("");
}

/* ================================================== */
// last_input = input.slice(-1); ==>> lấy ra phần tử cuối cùng (không phải phần tử mới nhập)

function ValidateInput (value) {

	let last_input = input.slice(-1);

	let input_array = input.split("");

	let input_array_length = input_array.length;

	// Kiểm tra xem giá trị key mới nhập với element cuối cùng của array có cùng là "." hay không
	// Cái này dùng để hiển thị 1 dấu "." duy nhất
	// tuy nhiên vẫn có thiếu sót là trường hợp có number nằm giữa 2 dấu chấm
	// if (value == "." && last_input == ".") {
	// 	return false;
	// }

	// đây là cách để đảm bảo rằng chỉ có 1 dấu "." duy nhất
	if (value == ".") {

		// if( last_input == "." || last_input == "(" || last_input == ")" || last_input == "+" || last_input == "-" || last_input == "*" || last_input == "/") {
		if ( specialKey.includes(last_input) ) {

			return false;

		} else {

			for( let i = input_array_length - 1; i >= 0; i--) {
				
				if( input_array[i] == '+' || input_array[i] == '-' || input_array[i] == '*' || input_array[i] == '/' ) {
					
					let data = input_array.slice( i + 1, input_array_length).join('');

					if( data.includes('.') ) {

						return false;

					}

					break;

				} else if( input_array[i] == '.') {
					
					return false;

					break;

				};

			};

		};

	};


	// tương tự như dấu chấm là các dấu toán tử liên tiếp không cho hiển thị
	// kiểm tra xem value nhập vào có phải là các "operators" không
	// nếu đúng là nhập "operator" thì kiểm tra tiếp "last_input" có phải là operator không
	// The includes() method returns true if an array contains a specified value.
	// The includes() method returns false if the value is not found.
	if (operators.includes(value)) {

		// if (operators.includes(last_input)) {
		if ( specialKey.includes(last_input) ) {

			return false;

		} else {
		
			return true;
		
		}



	}

	return true;
}

/* ================================================== */
function PerpareInput (input) {

	let input_array = input.split("");

	for (let i = 0; i < input_array.length; i++) {
	
		if (input_array[i] == "%") {
	
			input_array[i] = "/100";
	
		}

	}

	return input_array.join("");
}

/* ================================================== */
/* 
	https://www.w3schools.com/jsref/jsref_slice_string.asp

	Syntax: string.slice(start, end) ==>> The end position (up to, but not including).

	The slice() method returns the extracted part in a new string.

	The slice() method does not change the original string.

	A negative number selects from the end of the string.
*/



/* ================================================== */
function bracketsCheck(input) {

	let input_array = input.split("");

	let input_array_length = input_array.length;

	let numberOfOpenBracket = 0;
	let numberOfCloseBracket = 0;


	if ( 
		input.indexOf( "(" ) == -1 || 
		input.indexOf( "(" ) != -1 && input.indexOf( ")" ) != -1 && input.lastIndexOf("(") < input.lastIndexOf(")") 
	) {
		
		// nếu element cuối cùng trước khi bấm bracket là ngoặc đóng ")" thì sẽ kiểm tra xem số lượng ngoặc mở và đóng có bằng nhau không
		// nếu số lượng ngoặc mở > số lượng ngoặc đóng thì thêm ngoặc đóng
		// còn nếu bằng rồi thì không thêm nữa
		if ( input_array[input_array_length-1] == ")" ) {

			// Vòng FOR này để kiểm tra số lượng "(" và ")"
			// Sau đó dùng IF để kiểm tra xem nếu số lượng "(" lớn hơn ")" thì sẽ thêm ")" vô
			// Còn nếu số lượng ngoặc mở "(" và đóng ")" bằng nhau thì không thêm gì nữa
			for ( let i = 0 ; i < input_array_length; i++ ) {
				
				if( input_array[i] == '(' ) {
				
					numberOfOpenBracket++;
				
				};

				if( input_array[i] == ')' ) {
				
					numberOfCloseBracket++;
				
				};

			};

			if ( numberOfOpenBracket > numberOfCloseBracket ) {
				
				return ")";

			} else if ( numberOfOpenBracket == numberOfCloseBracket ) {

				return "";

			}
		
		} else if ( input_array[input_array_length - 1] == "+" || 
					input_array[input_array_length - 1] == "-" || 
					input_array[input_array_length - 1] == "*" || 
					input_array[input_array_length - 1] == "/" ) {
				
				// cái này để kiểm tra rằng input lần nhập cuối là các toán tử thì chắc chắn là có thể thêm ngoặc mở "("
				return "(";

		} else if ( input_array == "") {

				// trường hợp này là lúc ban đầu input chưa có gì cả tức là input_array là empty
				return "(";

		} else if ( input_array[input_array_length - 1] != "+" || 
					input_array[input_array_length - 1] != "-" || 
					input_array[input_array_length - 1] != "*" || 
					input_array[input_array_length - 1] != "/" ) {
	
				// trường hợp này là input nhập lần cuối là number thì không cần thêm gì nữa hết
				return "";
		
		} else {

				return ")";

		}

	} else if (	input.indexOf("(") != -1 && input.indexOf(")") == -1 || 
				input.indexOf("(") != -1 && input.indexOf(")") != -1 && input.lastIndexOf("(") > input.lastIndexOf(")") ) {
		
		if (input_array[input_array_length - 1] == "+" || 
			input_array[input_array_length - 1] == "-" || 
			input_array[input_array_length - 1] == "*" || 
			input_array[input_array_length - 1] == "/" ) {

				return "(";

		} else {
			
			if ( input_array[input_array_length - 1] == "(" ) {
				
				// trường hợp này là khi lần cuối là ngoặc mở "(" thì không cần thêm ngoặc mở hoặc đóng nữa là cần là number
				return "";

			} else {

				return ")";

			};

		};
			
	};

}








